'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import RootState from './state';
import Game from './modules/game';

Vue.use(Vuex);

export default function createStore(initState: any = {}) {
  const { title, url, origin, locale, csrf, game } = initState;
  const state = { title, url, origin, locale, csrf };
  return new Vuex.Store<RootState>({
    state,
    modules: {
      game: new Game(game)
    }
  });
}