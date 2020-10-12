'use strict';

import { Application } from 'egg';
import DB from '../lib/db/base';
import DBFactory from '../lib/db/factory';
import SocketServer from '../common/socketServer';
const SocketServerSymbol = Symbol('Application#socketServer');
export default {
  get db(): DB {
    return DBFactory();
  },
  /**
   * 挂载到 this.app 下的 socket server
   */
  get socketServer(): SocketServer {
    if (!this[SocketServerSymbol]) {
      this[SocketServerSymbol] = new SocketServer(this as Application);
    }
    return this[SocketServerSymbol];
  },
};
