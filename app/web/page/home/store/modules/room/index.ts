import axios from 'axios';
import { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  SET_ROOM_INFO,
} from './type';

import RootState from '../../state';
import RoomState from './state';


export default class RoomModule implements Module<RoomState, RootState> {
  state: RoomState;

  actions: ActionTree<RoomState, RootState> = {
    saveRoom({ commit, dispatch, state , rootState}, data) {
      commit(SET_ROOM_INFO, data);
    },
    quitRoom({ commit, dispatch, state , rootState}) {
      commit(SET_ROOM_INFO, { id: '', masterId: '', playerList: [], hasStarted: false });
    },
  };

  mutations: MutationTree<RoomState> = {
    [SET_ROOM_INFO](state, data) {
      console.log('>>> store commit ', data);
      state.id = data.id;
      state.playerList = data.playerList;
      state.masterId = data.masterId;
      state.hasStarted = data.hasStarted;
    },
  };

  constructor(initState) {
    this.state = { ...initState };
  }
}
