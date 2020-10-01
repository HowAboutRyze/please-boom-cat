import DB from '../lib/db/base';
import SocketServer from '../common/socketServer';
import { Socekt } from '../model/game';
declare module 'egg' {
  interface Application {
    db: DB;
    socketServer: SocketServer;
  }

  interface Context {
    db: DB;
    socket: Socekt;
  }
}
