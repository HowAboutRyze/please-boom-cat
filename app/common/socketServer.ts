import { PlainObject } from 'egg';

interface UserHash {
  [key: string]: User;
}

export default class SocketServer {
  public userList: Array<User> = [];
  public userHash: UserHash = {};
  public app: any;

  constructor(app) {
    this.app = app;
  }


  public onGetUserInfo(socket, userInfo) {
    const user = new User({ ...userInfo, socket });
    this.addUser(user);
  }

  public onSocketDisconnect(socket) {
    const { id } = socket;
    const index = this.userList.findIndex(u => u.socketId === id);
    if (index !== -1) {
      this.userList.splice(index, 1);
    }
    delete this.userHash[id];
    console.log('>>>>> disconnect', this.userList);
  }

  public addUser(user: User) {
    const { socketId } = user;
    let userInfo = this.getUserBySocket(socketId);
    if (userInfo) {
      const index = this.userList.findIndex(u => u.socketId === socketId);
      if (index !== -1) {
        this.userList.splice(index, 1);
      }
    }
    this.userList.push(user);
    this.userHash[socketId] = user;
    console.log('>>>>>> userlist:', this.userList);
  }

  public getUserBySocket(socketId) {
    return this.userHash[socketId];
  }
}

class User {
  public socket: PlainObject;
  public userId: string;
  public socketId: string;
  public avatar: string;
  public nickName: string;
  constructor({ socket, userId = '', avatar = '', nickName = '' }) {
    this.socket = socket;
    this.userId = userId;
    this.socketId = socket.id || '';
    this.avatar = avatar;
    this.nickName = nickName;
  }
}