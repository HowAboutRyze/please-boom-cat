'use strict';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import RootState from './state';
import User from './modules/user';
import Room from './modules/room';
import Game from './modules/game';
import Socket from '@lib/socket';

Vue.use(Vuex);

export default function createStore(initState: any = {}): Store<RootState> {
  const { title, url, origin, locale, csrf, user } = initState;
  const state = { title, url, origin, locale, csrf };
  const store = new Vuex.Store<any>({
    state,
    modules: {
      user: new User(user),
      room: new Room({ id: '', masterId: '', playerList: [], hasStarted: false }),
      game: new Game({
        id: '',
        msg: '',
        type: null,
        remain: 0,
        origin: null,
        target: null,
        cards: [],
        playerList: [],
        currentPlayer: '',

        // 弹窗
        showPop: false,
        popTitle: '',
        popText: '',
      }),
    }
  });

  // 挂载 socketServer
  const socketServer = new Socket(store);
  Vue.prototype.$socketServer = socketServer;

  return store;
}
