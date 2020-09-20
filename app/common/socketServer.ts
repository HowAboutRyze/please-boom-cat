import { PlainObject } from 'egg';
import UserServer from './user';
import RoomServer from './room';
import GameServer from './gameServer';
import { IGamePlayer } from './game';
import { START_GAMER } from '../lib/constant';

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
      console.log('>>>> 临时看看');
      const room = this.roomServer.getRoomById(user.roomId);
      room.removePlayer(user);
      if (room.isEmpty) {
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
    socket.on(START_GAMER, data => {
      const playerList: IGamePlayer[] = data.playerList.map(p => ({ userId: p.userId, cards: [], isOver: false }));
      this.gameServer.addGame({ playerList });
    });
  }
}
