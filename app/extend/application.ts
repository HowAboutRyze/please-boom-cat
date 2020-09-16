import { Application } from 'egg';
import DB from '../lib/db/base';
import DBFactory from '../lib/db/factory';
import SocketServer from '../common/socketServer';
const SocketServerSymbol = Symbol('Application#socketServer');
export default {
  get db(): DB {
    return DBFactory();
  },
  get socketServer(): SocketServer {
    if (!this[SocketServerSymbol]) {
      this[SocketServerSymbol] = new SocketServer(this);
    }
    return this[SocketServerSymbol];
  }
};