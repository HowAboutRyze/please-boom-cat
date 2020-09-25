import { Vue, Component, Emit } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { cardMap, CardType } from '../../../../../lib/constant';
import { IGamePlay, PlayInfoType } from '../../../../../model/game';

@Component
export default class Game extends Vue {
  public selectedCards: number[] = [];
  public position: number  = 0;
  public targetPlayer = '';
  public positionPopShow  = false;

  @State(state => state.user.user) user;
  @State(state => state.game.id) gameId;
  @State(state => state.game.currentPlayer) currentPlayer;
  @State(state => state.game.remain) remain;
  @State(state => state.game.showPop) showPop;
  @State(state => state.game.popTitle) popTitle;
  @State(state => state.game.popText) popText;
  @State(state => state.room.playerList) roomPlayerList;
  @Getter('otherPlayers') otherPlayers: any;
  @Getter('selfGameInfo') selfGameInfo: any;
  @Getter('waitingDefuse') waitingDefuse: any;
  @Action('removeCards') removeCards;

  get canShowCards() {
    return this.selectedCards.length > 0;
  }

  /**
   * 是否当前出牌玩家
   * @param userId 用户id
   */
  isCurrentPlayer(userId) {
    return userId === this.currentPlayer;
  }

  /**
   * 卡牌 class
   * @param index 
   */
  cardClass(index) {
    return `card ${this.isSelected(index) ? 'selected' : ''}`
  }

  /**
   * 卡牌被选中了
   * @param index 卡牌序号
   */
  isSelected(index) {
    return this.selectedCards.indexOf(index) !== -1;
  }

  /**
   * 摸牌
   */
  touchCard() {
    const data: IGamePlay = {
      id: this.gameId,
      type: PlayInfoType.touch,
      origin: this.user.userId,
    }
    this.$socketServer.sendPlayData(data);
  }

  /**
   * 选中牌准备出
   * @param type 卡牌类型
   * @param index 卡牌序号
   */
  selectCard(type: number, index: number) {
    if (this.canShowCards) {
      const sIndex = this.selectedCards.indexOf(index);
      if (sIndex !== -1) {
        // 若已选中，移除即可
        this.selectedCards.splice(sIndex, 1);
        return;
      }
      if (this.selectedCards.every(i => this.selfGameInfo.cards[i] === type)) {
        // 若选中的都是同类型卡牌，继续添加进去
        this.selectedCards.push(index);
        return;
      }
      // 清空数组，放入卡牌
      this.clearSelectedCards();
      this.selectedCards.push(index);
    } else {
      // 没选过牌，选牌
      this.selectedCards.push(index);
    }
  }

  /**
   * 清空选中牌组
   */
  clearSelectedCards() {
    this.selectedCards = [];
  }

  /**
   * 想出牌
   */
  wantShowCard() {
    if (!this.canShowCards) {
      return;
    }
    if (this.selectedCards.length > 1) {
      // TODO: 哇塞，出对子或者多张牌，需要选目标
      console.log('>>>> 出对子啊', this.selectedCards);
      return;
    }
    const index = this.selectedCards[0];
    const cardType = this.selfGameInfo.cards[index];
    // TODO: 否决, 选一名玩家
    // TODO: 需要有玩家正在执行某种行为, 并且只能指定该玩家
    if (cardType === CardType.nope) {
      console.log('>>> 否决');
      // 选玩家
      return;
    }
    // TODO: 攻击, 选一名玩家
    if (cardType === CardType.attack) {
      console.log('>>> 攻击');
      // 选玩家
      return;
    }
    // TODO: 帮助, 选一名玩家
    if (cardType === CardType.favor) {
      console.log('>>> 帮助');
      // 选玩家
      return;
    }
    if (cardType === CardType.defuse) {
      console.log('>>> 拆解');
      this.showPositionPop();
      return;
    }
    // 其他卡牌直接出吧
    this.showCards();
  }

  /**
   * 出牌吧
   */
  showCards() {
    const selectCardTypes = this.selectedCards.map(index => this.selfGameInfo.cards[index]);
    const data: IGamePlay = {
      id: this.gameId,
      type: PlayInfoType.show,
      origin: this.user.userId,
      target: this.targetPlayer,
      cards: selectCardTypes,
      position: this.position,
    }
    this.$socketServer.sendPlayData(data);

    this.removeCards(selectCardTypes);

    this.clearSelectedCards();
    this.position = 0;
  }

  setBoomPosition() {
    this.hidePositionPop();
    this.showCards();
  }

  showPositionPop() {
    this.positionPopShow = true;
  }

  hidePositionPop() {
    this.positionPopShow = false;
  }

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

  /**
   * 退出游戏
   */
  async quitGame() {
    console.log('>>>>> 退出游戏');
    await this.$socketServer.disconnect();
    this.$router.push(`/match`);
  }
}
