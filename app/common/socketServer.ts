import { PlainObject, Application } from 'egg';
import UserServer from './user';
import RoomServer from './room';
import GameServer from './gameServer';
import { GamePlayer } from './game';
import { User as TypeUser } from './user';
import { SOCKET_START_GAMER, SOCKET_GAMER_PLAY, SOCKET_JOIN_ROOM, SOCKET_DISCONNECT, SOCKET_RECONNECT } from '../lib/constant';
import { GamePlay, PlayerStatus, GameInfoType, Socekt } from '../model/game';
import { ReconnectMsg } from '../model/room';
import { UserData } from '../model/user';

export default class SocketServer {
  public app: Application;
  public config: PlainObject;
  public roomServer: RoomServer;
  public userServer: UserServer;
  public gameServer: GameServer;

  constructor(app: Application) {
    this.app = app;
    // 先占个位
    this.config = app.config.socketServer;
    this.roomServer = new RoomServer(app.config.socketServer);
    this.userServer = new UserServer(app.config.socketServer);
    this.gameServer = new GameServer(app.config.socketServer);
  }

  /**
   * 用户连接游戏
   * @param socket 用户 websocket 实例
   * @param userInfo 用户信息
   */
  public onSocketConnect(socket: Socekt, userInfo: UserData): void {
    this.userServer.addUser({ ...userInfo, socket });
    this.addSocketListener(socket);
  }

  /**
   * 用户断开连接
   * @param socket 用户 websocket 实例
   */
  public onSocketDisconnect(socket: Socekt): void {
    const user = this.userServer.getUserBySocket(socket.id);
    if (!user) {
      // 用户主动断开的话，就直接移除了
      return;
    }
    // 从房间里移除用户咯
    if (user.roomId) {
      const room = this.roomServer.getRoomById(user.roomId);
      console.log('>>>> 用户断开连接', socket.id, user.userId);
      // 游戏开始就只改玩家状态，没开始就从房间移除
      if (room.hasStarted && room.gameId) {
        // 如果游戏已经开始，更改玩家状态为掉线
        console.log('>>> 游戏已经开始，用户断开连接', user.userId);
        const game = this.gameServer.getGameById(room.gameId);
        const player = game.getPlayerById(user.userId);
        if (player.user.socketId === socket.id) {
          // 重连之后，服务器有可能先收到重连消息再收到掉线消息，所以得判断 socketId 是否相等再做操作
          player.status = PlayerStatus.offline;
          game.sendGameInfo({ type: GameInfoType.statusChange });
        }
      } else {
        // 没开始游戏，直接退出房间
        room.removePlayerBySocket(user);
        if (room.isEmpty) {
          // 人去房空，顺便把游戏也销毁了吧
          if (room.gameId) {
            this.gameServer.removeGame(room.gameId);
          }
          this.roomServer.removeRoom(room.id);
        }
        room.broadcast();
      }
    }
    // 将用户缓存清掉
    this.userServer.removeUser(socket);
  }

  /**
   * 添加 socket 事件监听
   * @param socket
   */
  public addSocketListener(socket: Socekt): void {
    // 开始游戏
    socket.on(SOCKET_START_GAMER, () => {
      const user = this.userServer.getUserBySocket(socket.id);
      const room = this.roomServer.getRoomById(user.roomId);
      if (!user || !room || room.gameId) {
        return;
      }

      const playerList: GamePlayer[] = room.playerList.map(p => ({
        userId: p.userId,
        cards: [],
        isOver: false,
        status: PlayerStatus.online,
        user: p,
      }));
      const game = this.gameServer.addGame({ roomId: user.roomId, playerList });

      // 房间绑定游戏id
      room.gameId = game.id;
      room.hasStarted = true;

      game.sendGameInfo();
    });

    // 游戏中，玩家发送消息过来了
    socket.on(SOCKET_GAMER_PLAY, (data: GamePlay) => {
      console.log('玩家在干嘛？', data);
      if (!data.id) {
        return;
      }

      const game = this.gameServer.getGameById(data.id);
      game.gamePlayHandle(data);
    });

    socket.on(SOCKET_DISCONNECT, () => {
      console.log('>>>>> 用户主动断开连接');
      const user = this.userServer.getUserBySocket(socket.id);
      // 从房间里移除用户咯
      if (user && user.roomId) {
        const room = this.roomServer.getRoomById(user.roomId);
        if (room.hasStarted && room.gameId) {
          const game = this.gameServer.getGameById(room.gameId);
          const player = game.getPlayerById(user.userId);
          if (game.currentPlayer === user.userId) {
            // 如果当前出牌玩家是这个离开房间的人，就换下一个玩家出牌
            game.nextPlayerTurn();
          }
          player.status = PlayerStatus.leave;
          // 如果只有一个玩家了，游戏结束
          if (game.survivePlayers.length <= 1) {
            game.sendGameInfo({ type: GameInfoType.gameOver, origin: user.userId });
          } else {
            game.sendGameInfo({ type: GameInfoType.statusChange });
          }
        }
        room.removePlayerBySocket(user);
        if (room.isEmpty) {
          // 人去房空，顺便把游戏也销毁了吧
          if (room.gameId) {
            this.gameServer.removeGame(room.gameId);
          }
          this.roomServer.removeRoom(room.id);
        }
        room.broadcast();
        this.userServer.removeUser(socket);
      }
      socket.disconnect(true);
    });

    socket.on(SOCKET_JOIN_ROOM, () => {
      console.log('>>>>> 加入房间');
      const user = this.userServer.getUserBySocket(socket.id);
      this.userJoinNewRoom(user);
    });

    socket.on(SOCKET_RECONNECT, (data: ReconnectMsg) => {
      console.log('>>> 重连', socket.id, data);
      const { roomId } = data;
      const user = this.userServer.getUserBySocket(socket.id);
      if (!user) {
        return;
      }
      console.log('>>> 重连找用户', user);
      const room = this.roomServer.getRoomById(roomId);
      // 没有房间重新进入
      if (!room) {
        this.userJoinNewRoom(user);
        return;
      }
      // 房间没有开始游戏，加入房间
      if (!room.gameId) {
        user.roomId = roomId;
        room.addPlayer(user);
        room.broadcast();
        return;
      }
      // 已开始游戏
      console.log('>>>> 重连，已开始游戏');
      const game = this.gameServer.getGameById(room.gameId);
      const gamePlayer = game.getPlayerById(user.userId);
      // 游戏中没有该玩家，让他进入新房间
      if (!gamePlayer) {
        this.userJoinNewRoom(user);
        return;
      }
      // 更改游戏中玩家状态
      user.roomId = roomId;
      gamePlayer.status = PlayerStatus.online;
      gamePlayer.user = user;
      room.updatePlayer(user);
      game.sendGameInfo({ type: GameInfoType.statusChange });
    });
  }

  /**
   * 玩家加入新房间
   * @param user 玩家
   */
  public userJoinNewRoom(user: TypeUser): void {
    const room = this.roomServer.findJoinableRoom();
    user.roomId = room.id;
    room.addPlayer(user);
    room.broadcast();
  }
}
