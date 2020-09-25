import axios from 'axios';
import { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  SET_GAME_INFO,
  SET_PLAYER,
  SET_GAME_POP,
} from './type';
import { GameInfoType } from '../../../../../../model/game';

import RootState from '../../state';
import GameState from './state';
import { sleep } from '@lib/utils';


export default class GameModule implements Module<GameState, RootState> {
  state: GameState;

  getters: GetterTree<GameState, RootState> = {
    otherPlayers(state, getters, rootState): any {
      return state.playerList?.filter(player => player.userId !== rootState.user.user.userId) || [];
    },
    selfGameInfo(state, getters, rootState) {
      return state.playerList?.find(player => player.userId === rootState.user.user.userId) || {};
    },
    waitingDefuse(state, getters, rootState) {
      return state.type === GameInfoType.waitDefuse;
    },
  };

  actions: ActionTree<GameState, RootState> = {
    async showGamePop({ commit, dispatch, state , rootState}, data) {
      commit(SET_GAME_POP, { showPop: true, ...data });
      await sleep(2500);
      commit(SET_GAME_POP, { showPop: false });
      console.log('>>> 关闭了弹窗');
      commit(SET_GAME_INFO, data);
    },
    removeCards({ commit, dispatch, state , rootState}, data: number[]) {
      console.log('移除卡 data', data);
      const targetCards = [...data];
      const removeNum = targetCards.length;
      const playerIndex = state.playerList.findIndex(player => player.userId === rootState.user.user.userId);
      if (playerIndex == null && playerIndex === -1) {
        return;
      }
      const player = state.playerList[playerIndex];
      // @ts-ignore
      const cards = player.cards.reduce((group, currCard) => {
        if (targetCards.includes(currCard)) {
          targetCards.shift();
          return group;
        }
        return [...group, currCard];
      }, []);
      console.log('移除卡 cards', cards);
      const total = player.total - removeNum;
      commit(SET_PLAYER, { index: playerIndex, player: { ...player, cards, total } });
    },
    saveGame({ commit, dispatch, state , rootState}, data) {
      commit(SET_GAME_INFO, data);
    },
  };

  mutations: MutationTree<GameState> = {
    [SET_GAME_INFO](state, data) {
      console.log('>>> store commit ', data);
      const res: GameState = { ...state, ...data};
      const { id, msg, type, remain, origin, target,
        cards, playerList, currentPlayer } = res;

      // TODO: 后面改成 toast 吧
      msg && console.log(msg);

      state.id = id;
      state.msg = msg;
      state.type = type;
      state.remain = remain;
      state.origin = origin;
      state.target = target;
      state.cards = cards || [];
      state.playerList = playerList || [];
      state.currentPlayer = currentPlayer;
    },
    [SET_PLAYER](state, data) {
      console.log('>>> store commit ', data);
      const { index, player } = data;
      state.playerList.splice(index, 1, player);
    },
    [SET_GAME_POP](state, data) {
      console.log('>>> store commit ', data);
      state.showPop = data.showPop;
      state.popTitle = data.popTitle || '';
      state.popText = data.popText || '';
    },
  };

  constructor(initState) {
    this.state = { ...initState };
  }
}