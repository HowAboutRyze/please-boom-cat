import axios from 'axios';
import { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  SET_USER_INFO,
} from './type';

import RootState from '../../state';
import UserState from './state';

axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 15000;
axios.defaults.xsrfHeaderName = 'x-csrf-token';
axios.defaults.xsrfCookieName = 'csrfToken';

export default class UserModule implements Module<UserState, RootState> {
  state: UserState;

  actions: ActionTree<UserState, RootState> = {
    async getUser({ commit, dispatch, state , rootState}, { id }) {
      const res = await axios.get(`${rootState.origin}/api/user/${id}`);
      commit(SET_USER_INFO, res.data);
    },
    async saveUser({ commit, dispatch, state, rootState }, data) {
      // node need auth
      const res = await axios.post(`${rootState.origin}/api/user/save`, data);
      commit(SET_USER_INFO, res.data);
      return res;
    },
  };

  mutations: MutationTree<UserState> = {
    [SET_USER_INFO](state, data) {
      state.user = data;
    },
  };

  constructor(initState: any) {
    this.state = {
      user: {},
      ...initState
    };
  }
}
