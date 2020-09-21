import { Vue, Component, Emit } from 'vue-property-decorator';
import { State, Getter } from 'vuex-class';
import { cardMap } from '../../../../../lib/constant';

@Component
export default class Game extends Vue {
  @State(state => state.user.user) user;
  @State(state => state.game.currentPlayer) currentPlayer;
  @State(state => state.game.remain) remain;
  @State(state => state.room.playerList) roomPlayerList;
  @Getter('otherPlayers') otherPlayers: any;
  @Getter('selfGameInfo') selfGameInfo: any;

  getNickName(userId) {
    const player = this.roomPlayerList.find(p => p.userId === userId);
    return player?.nickName || '';
  }

  getCardName(type) {
    return cardMap[type]?.name || '未知卡牌';
  }

  getCardDesc(type) {
    return cardMap[type]?.desc || '未知卡牌详情';
  }

  async quitGame() {
    console.log('>>>>> 退出游戏');
    await this.$socketServer.disconnect();
    this.$router.push(`/match`);
  }
}
