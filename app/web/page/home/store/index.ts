'use strict';
import Vue from 'vue';
import Vuex from 'vuex';
import RootState from './state';
import User from './modules/user';

Vue.use(Vuex);

export default function createStore(initState: any = {}) {
  const { title, url, origin, locale, csrf, user } = initState;
  const state = { title, url, origin, locale, csrf };
  return new Vuex.Store<RootState>({
    state,
    modules: {
      user: new User(user)
    }
  });
}