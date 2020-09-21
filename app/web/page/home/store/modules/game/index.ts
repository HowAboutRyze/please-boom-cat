import axios from 'axios';
import { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  SET_GAME_INFO,
} from './type';

import RootState from '../../state';
import GameState from './state';


export default class GameModule implements Module<GameState, RootState> {
  state: GameState;

  getters: GetterTree<GameState, RootState> = {
    otherPlayers(state, getters, rootState): any {
      return state.playerList?.filter(player => player.userId !== rootState.user.user.userId) || [];
    },
    selfGameInfo(state, getters, rootState) {
      return state.playerList?.find(player => player.userId === rootState.user.user.userId) || {};
    }
  };

  actions: ActionTree<GameState, RootState> = {
    saveGame({ commit, dispatch, state , rootState}, data) {
      commit(SET_GAME_INFO, data);
    },
  };

  mutations: MutationTree<GameState> = {
    [SET_GAME_INFO](state, data) {
      console.log('>>> store commit ', data);
      state.id = data.id;
      state.type = data.type;
      state.remain = data.remain;
      state.origin = data.origin;
      state.target = data.target;
      state.cardType = data.cardType;
      state.playerList = data.playerList;
      state.currentPlayer = data.currentPlayer;
    },
  };

  constructor(initState) {
    this.state = { ...initState };
  }
}