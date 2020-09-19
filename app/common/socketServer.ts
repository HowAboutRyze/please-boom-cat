import { PlainObject } from 'egg';
import UserServer from './user';
import RoomServer from './room';

export default class SocketServer {
  public app: any;
  public config: PlainObject;

  constructor(app) {
    this.app = app;
    // 先占个位
    this.config = app.config.socketServer;
  }

  // TODO: 增加个房间功能

  /**
   * 用户连接游戏
   * @param socket 用户 websocket 实例
   * @param userInfo 用户信息 
   */
  public onSocketConnect(socket, userInfo) {
    const user = UserServer.addUser({ ...userInfo, socket });
    const room = RoomServer.findJoinableRoom();
    user.roomId = room.id;
    room.addPlayer(user);
  }

  /**
   * 用户断开连接
   * @param socket 用户 websocket 实例
   */
  public onSocketDisconnect(socket) {
    // TODO: 断开连接就移除用户，那如果是游戏中，用户重连怎么办？

    const user = UserServer.getUserBySocket(socket.id);
    // 从房间里移除用户咯
    if (user.roomId) {
      const room = RoomServer.getRoomById(user.roomId);
      room.removePlayer(user);
      if (room.isEmpty) {
        RoomServer.removeRoom(room.id);
      }
    }
    UserServer.removeUser(socket);
  }
}
