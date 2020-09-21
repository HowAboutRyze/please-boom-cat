'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import RootState from './state';
import User from './modules/user';
import Room from './modules/room';
import Game from './modules/game';
import Socket from '@lib/socket';

Vue.use(Vuex);

export default function createStore(initState: any = {}) {
  const { title, url, origin, locale, csrf, user } = initState;
  const state = { title, url, origin, locale, csrf };
  const store = new Vuex.Store<RootState>({
    state,
    modules: {
      user: new User(user),
      room: new Room({ id: '', masterId: '', playerList: [], hasStarted: false }),
      game: new Game({
        id: '',
        type: null,
        remain: 0,
        origin: null,
        target: null,
        cards: [],
        playerList: [],
        currentPlayer: '',
      }),
    }
  });

  // 挂载 socketServer
  const socketServer = new Socket(store);
  Vue.prototype.$socketServer = socketServer;

  return store;
}