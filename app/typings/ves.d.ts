import DB from '../lib/db/base';
import SocketServer from '../common/socketServer';
declare module 'egg' {
  interface Application {
    db: DB;
    socketServer: SocketServer;
  }

  interface Context {
    db: DB;
    socket: any;
  }
}