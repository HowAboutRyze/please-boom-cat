import { Module, ActionTree, MutationTree } from 'vuex';
import {
  SET_ROOM_INFO,
} from './type';

import RootState from '../../state';
import { IRoomInfo } from '../../../../../../model/room';

export default class RoomModule implements Module<Partial<IRoomInfo>, RootState> {
  state: Partial<IRoomInfo>;

  actions: ActionTree<Partial<IRoomInfo>, RootState> = {
    saveRoom({ commit }, data) {
      commit(SET_ROOM_INFO, data);
    },
    quitRoom({ commit }) {
      commit(SET_ROOM_INFO, { id: '', masterId: '', playerList: [], hasStarted: false });
    },
  };

  mutations: MutationTree<Partial<IRoomInfo>> = {
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
