import { PlainObject } from 'egg';
import UserServer from './user';
import RoomServer from './room';
import GameServer from './gameServer';
import { IGamePlayer } from './game';
import { SOCKET_START_GAMER, SOCKET_GAMER_PLAY } from '../lib/constant';
import { IGamePlay } from '../model/game';

export default class SocketServer {
  public app: any;
  public config: PlainObject;
  public roomServer: RoomServer;
  public userServer: UserServer;
  public gameServer: GameServer;

  constructor(app) {
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
  public onSocketConnect(socket, userInfo) {
    const user = this.userServer.addUser({ ...userInfo, socket });
    const room = this.roomServer.findJoinableRoom();
    user.roomId = room.id;
    room.addPlayer(user);
    room.broadcast();

    this.addSocketListener(socket);
  }

  /**
   * 用户断开连接
   * @param socket 用户 websocket 实例
   */
  public onSocketDisconnect(socket) {
    // TODO: 断开连接就移除用户，那如果是游戏中，用户重连怎么办？

    const user = this.userServer.getUserBySocket(socket.id);
    // 从房间里移除用户咯
    if (user.roomId) {
      const room = this.roomServer.getRoomById(user.roomId);
      room.removePlayer(user);
      if (room.isEmpty) {
        // 人去房空，顺便把游戏也销毁了吧
        if (room.gameId) {
          this.gameServer.removeGame(room.gameId);
        }
        this.roomServer.removeRoom(room.id);
      }
      room.broadcast();
    }
    this.userServer.removeUser(socket);
  }

  /**
   * 添加 socket 事件监听
   * @param socket
   */
  public addSocketListener(socket) {
    // 开始游戏
    socket.on(SOCKET_START_GAMER, () => {
      const user = this.userServer.getUserBySocket(socket.id);
      const room = this.roomServer.getRoomById(user.roomId);
      if (room.gameId) {
        return;
      }

      const playerList: IGamePlayer[] = room.playerList.map(p => ({ userId: p.userId, cards: [], isOver: false, user: p }));
      const game = this.gameServer.addGame({ roomId: user.roomId, playerList });

      // 房间绑定游戏id
      room.gameId = game.id;
      room.hasStarted = true;

      game.sendGameInfo();
    });

    // 游戏中，玩家发送消息过来了
    socket.on(SOCKET_GAMER_PLAY, (data: IGamePlay) => {
      console.log('玩家在干嘛？', data);
      if (!data.id) {
        return;
      }

      const game = this.gameServer.getGameById(data.id);
      game.gamePlayHandle(data);
    })
  }
}
