import axios from 'axios';
import { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  SET_GAME_INFO,
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
      const _playerList = state.playerList?.map(p => ({ ...p, cards: [...p.cards] })) || [];
      const playerIndex = _playerList.findIndex(player => player.userId === rootState.user.user.userId);
      if (playerIndex == null && playerIndex === -1) {
        return;
      }
      const player = _playerList[playerIndex];
      // @ts-ignore
      const resCards = player.cards.reduce((group, currCard) => {
        if (targetCards.includes(currCard)) {
          targetCards.shift();
          return group;
        }
        return [...group, currCard];
      }, []);
      console.log('移除卡 resCards', resCards);
      _playerList[playerIndex] = { ...player, cards: resCards };
      // TODO: 一个bug，更新完之后，用户卡牌数没变？？
      commit(SET_GAME_INFO, { playerList: _playerList });
    },
    saveGame({ commit, dispatch, state , rootState}, data) {
      commit(SET_GAME_INFO, data);
    },
  };

  mutations: MutationTree<GameState> = {
    [SET_GAME_INFO](state, data) {
      console.log('>>> store commit ', data);
      const res: GameState = { ...state, ...data};
      const { id, type, remain, origin, target,
        cards, playerList, currentPlayer } = res;
      state.id = id;
      state.type = type;
      state.remain = remain;
      state.origin = origin;
      state.target = target;
      state.cards = cards || [];
      state.playerList = playerList || [];
      state.currentPlayer = currentPlayer;
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