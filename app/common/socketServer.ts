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


  public onGetUserInfo(socketId, userInfo) {
    const user = new User({ ...userInfo, socketId });
    this.addUser(user);
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
  }

  public getUserBySocket(socketId) {
    return this.userHash[socketId];
  }
}

class User {
  public userId: string;
  public socketId: string;
  public avatar: string;
  public nickName: string;
  constructor(options) {
    this.userId = options.userId || '';
    this.socketId = options.socketId || '';
    this.avatar = options.avatar || '';
    this.nickName = options.nickName || '';
  }
}