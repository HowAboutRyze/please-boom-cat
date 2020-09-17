import { PlainObject } from 'egg';
import UserServer from './user';

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
   * 处理用户信息
   * @param socket 用户 websocket 实例
   * @param userInfo 用户信息 
   */
  public onGetUserInfo(socket, userInfo) {
    UserServer.addUser({ ...userInfo, socket });
  }

  /**
   * 用户断开连接
   * @param socket 用户 websocket 实例
   */
  public onSocketDisconnect(socket) {
    UserServer.removeUser(socket);
  }
}
