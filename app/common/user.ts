import { PlainObject } from 'egg';
import { SocketServerConfig } from '../model/game';

interface UserHash {
  [key: string]: User;
}

export class User {
  public socket: PlainObject;
  public userId: string;
  public socketId: string;
  public avatar: string;
  public nickName: string;
  public roomId?: string;
  constructor({ socket, userId = '', avatar = '', nickName = '' }) {
    this.socket = socket;
    this.userId = userId;
    this.socketId = socket.id || '';
    this.avatar = avatar;
    this.nickName = nickName;
  }
}

class UserServer {
  public config: SocketServerConfig;
  public userList: Array<User> = [];
  public userHash: UserHash = {};

  constructor(config: SocketServerConfig) {
    this.config = config;
  }

  /**
   * 新增用户
   * @param user 用户信息
   * @return user
   */
  public addUser(user): User {
    const newUser = new User(user);
    const { socketId } = newUser;
    const userInfo = this.getUserBySocket(socketId);
    if (userInfo) {
      const index = this.userList.findIndex(u => u.socketId === socketId);
      if (index !== -1) {
        this.userList.splice(index, 1);
        delete this.userHash[socketId];
      }
    }
    this.userList.push(newUser);
    this.userHash[socketId] = newUser;
    console.log('>>>>>> userlist:', this.userList);
    return newUser;
  }

  /**
   * 移除用户
   * @param socket 用户 websocket 实例
   */
  public removeUser(socket): void {
    const socketId = socket.id;
    const index = this.userList.findIndex(u => u.socketId === socketId);
    if (index !== -1) {
      this.userList.splice(index, 1);
      delete this.userHash[socketId];
    }
    console.log('>>>>> disconnect', this.userList);
  }

  /**
   * 通过 websocket id 找到用户
   * @param socketId 用户的 websocket id
   */
  public getUserBySocket(socketId: string): User {
    return this.userHash[socketId];
  }
}

export default UserServer;
