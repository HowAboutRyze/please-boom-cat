import { Module, ActionTree, MutationTree } from 'vuex';
import {
  SET_ROOM_INFO,
} from './type';

import RootState from '../../state';
import { RoomInfo } from '../../../../../../model/room';

export default class RoomModule implements Module<Partial<RoomInfo>, RootState> {
  state: Partial<RoomInfo>;

  actions: ActionTree<Partial<RoomInfo>, RootState> = {
    saveRoom({ commit }, data) {
      commit(SET_ROOM_INFO, data);
    },
    quitRoom({ commit }) {
      commit(SET_ROOM_INFO, { id: '', masterId: '', playerList: [], hasStarted: false });
    },
  };

  mutations: MutationTree<Partial<RoomInfo>> = {
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
