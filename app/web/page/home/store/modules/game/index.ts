import { Module, GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  SET_GAME_INFO,
  SET_PLAYER,
  SET_GAME_POP,
  SET_NOPE_POP,
  SET_PREDICT_POP,
  SET_PLAYER_LIST,
} from './type';
import { GameInfoType, GameInfo } from '../../../../../../model/game';

import RootState from '../../state';
import GameState, { GamePop } from './state';
import { sleep } from '@lib/utils';
import { CardType } from '../../../../../../lib/constant';


export default class GameModule implements Module<GameState, RootState> {
  state: GameState;

  getters: GetterTree<GameState, RootState> = {
    otherPlayers(state, getters, rootState): any {
      return state.playerList?.filter(player => player.userId !== rootState.user.user.userId) || [];
    },
    selfGameInfo(state, getters, rootState) {
      return state.playerList?.find(player => player.userId === rootState.user.user.userId) || {};
    },
    waitingDefuse(state) {
      return state.type === GameInfoType.waitDefuse;
    },
    // 玩家爆炸了
    someoneBoom(state) {
      return state.type === GameInfoType.boom ? state.origin : '';
    },
    // 玩家被帮助指定了
    someoneFavor(state) {
      return state.type === GameInfoType.favoring ? state.target : '';
    },
    // 玩家被帮助指定了
    favoringCard(state, getters, rootState) {
      return state.type === GameInfoType.favoring && state.target === rootState.user.user.userId;
    },
    // 玩家帮助了别人
    favored(state, getters, rootState) {
      return state.type === GameInfoType.favored && state.origin === rootState.user.user.userId;
    },
    // 玩家被别人帮助了
    wasFavored(state, getters, rootState) {
      return state.type === GameInfoType.favored && state.target === rootState.user.user.userId;
    },
  };

  actions: ActionTree<GameState, RootState> = {
    async showGamePop({ commit }, data: GameInfo & GamePop) {
      commit(SET_GAME_POP, { showPop: true, ...data });
      await sleep(2500);
      commit(SET_GAME_POP, { showPop: false });
      console.log('>>> 关闭了弹窗');
      commit(SET_GAME_INFO, data);
    },
    async playerBoom({ dispatch, rootState }, data: GameInfo) {
      // FIXME: 如何优雅的从 vuex 里通过 userId 去获取这个 store.state.room.playerList[index].nickName 呢？
      const { origin } = data;
      const player = rootState.room.playerList.find(p => p.userId === origin);
      const nickName = player?.nickName || '';
      await dispatch('showGamePop', { ...data, popTitle: 'Congratulation', popText: `玩家 ${nickName} 抽到爆炸猫了！！` });
    },
    async waitDefuse({ dispatch, rootState }, data) {
      const { origin } = data;
      const player = rootState.room.playerList.find(p => p.userId === origin);
      const nickName = player?.nickName || '';
      await dispatch('showGamePop', { ...data, popTitle: 'Congratulation', popText: `玩家 ${nickName} 抽到爆炸猫了！！` });
    },
    async gameOver({ dispatch, rootState }, data) {
      const { origin } = data;
      const player = rootState.room.playerList.find(p => p.userId === origin);
      const nickName = player?.nickName || '';
      await dispatch('showGamePop', { ...data, popTitle: 'Congratulation', popText: `玩家 ${nickName} 爆炸了！！` });
    },
    removeCards({ commit, state, rootState }, data: number[]) {
      console.log('移除卡 data', data);
      const targetCards = [...data];
      const removeNum = targetCards.length;
      const playerIndex = state.playerList.findIndex(player => player.userId === rootState.user.user.userId);
      if (playerIndex == null && playerIndex === -1) {
        return;
      }
      const player = state.playerList[playerIndex];
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
    async saveGame({ commit, dispatch, getters, rootState }, data) {
      commit(SET_GAME_INFO, data);
      const { type, origin, predictCards } = data;
      console.log('==== state', getters.selfGameInfo, type === GameInfoType.play, origin !== rootState.user.user.userId);
      const hasNope = getters.selfGameInfo.cards.includes(CardType.nope);
      const isOver = getters.selfGameInfo.isOver;
      // 如果是别的玩家出牌,且有否决,可以否决
      if (type === GameInfoType.play && origin !== rootState.user.user.userId && hasNope && !isOver) {
        dispatch('triggerNopePop', true);

      } else {
        dispatch('triggerNopePop', false);
      }

      // 如果预言了牌，展开预言弹窗
      if (predictCards.length > 0) {
        dispatch('triggerPredictPop', true);
        await sleep(4000);
        dispatch('triggerPredictPop', false);
      } else {
        dispatch('triggerPredictPop', false);
      }
    },
    triggerNopePop({ commit }, data: boolean) {
      commit(SET_NOPE_POP, data);
    },
    triggerPredictPop({ commit }, data: boolean) {
      commit(SET_PREDICT_POP, data);
    },
    quitGame({ commit }) {
      commit(SET_GAME_INFO, {
        id: '',
        msg: '',
        type: null,
        remain: 0,
        origin: null,
        target: null,
        cards: [],
        waitingNope: false,
        playerList: [],
        currentPlayer: '',
        predictCards: [],
      });
    },
  };

  mutations: MutationTree<GameState> = {
    [SET_GAME_INFO](state, data) {
      console.log('>>> store commit ', data);
      const res: GameState = { ...state, ...data };
      const { id, msg, type, remain, origin, target, cards,
        waitingNope, playerList, currentPlayer, predictCards } = res;

      // TODO: 后面改成 toast 吧
      msg && console.log(msg);

      state.id = id;
      state.msg = msg;
      state.type = type;
      state.remain = remain;
      state.origin = origin;
      state.target = target;
      state.cards = cards || [];
      state.waitingNope = waitingNope;
      state.playerList = playerList || [];
      state.currentPlayer = currentPlayer;
      state.predictCards = predictCards;
    },
    [SET_PLAYER](state, data) {
      console.log('>>> store commit [SET_PLAYER]', data);
      const { index, player } = data;
      state.playerList.splice(index, 1, player);
    },
    [SET_GAME_POP](state, data) {
      console.log('>>> store commit [SET_GAME_POP]', data);
      state.showPop = data.showPop;
      state.popTitle = data.popTitle || '';
      state.popText = data.popText || '';
    },
    [SET_NOPE_POP](state, data) {
      console.log('>>> store commit [SET_NOPE_POP]', data);
      state.nopePopShow = data;
    },
    [SET_PREDICT_POP](state, data) {
      console.log('>>> store commit [SET_PREDICT_POP]', data);
      state.predictPopShow = data;
    },
    [SET_PLAYER_LIST](state, data) {
      console.log('>>> store commit [SET_PLAYER_LIST]', data);
      state.playerList = data;
    },
  };

  constructor(initState) {
    this.state = { ...initState };
  }
}
