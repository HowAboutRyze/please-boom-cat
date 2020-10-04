import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { cardMap, CardType } from '../../../../../lib/constant';
import { GamePlay, PlayInfoType, GameInfoType } from '../../../../../model/game';
import RootState from '@store/state';

@Component
export default class Game extends Vue {
  public selectedCards: number[] = [];
  public position  = 0;
  public targetPlayer = '';
  public positionPopShow  = false;

  @State((state: RootState) => state.user.user) user;
  @State((state: RootState) => state.game.id) gameId;
  @State((state: RootState) => state.game.type) gameType;
  @State((state: RootState) => state.game.origin) gameOrigin;
  @State((state: RootState) => state.game.cards) gameCards;
  @State((state: RootState) => state.game.waitingNope) waitingNope;
  @State((state: RootState) => state.game.currentPlayer) currentPlayer;
  @State((state: RootState) => state.game.predictCards) predictCards;
  @State((state: RootState) => state.game.remain) remain;
  @State((state: RootState) => state.game.showPop) showPop;
  @State((state: RootState) => state.game.nopePopShow) nopePopShow;
  @State((state: RootState) => state.game.predictPopShow) predictPopShow;
  @State((state: RootState) => state.game.popTitle) popTitle;
  @State((state: RootState) => state.game.popText) popText;
  @State((state: RootState) => state.room.playerList) roomPlayerList;
  @Getter('otherPlayers') otherPlayers;
  @Getter('selfGameInfo') selfGameInfo;
  @Getter('waitingDefuse') waitingDefuse;
  @Getter('someoneBoom') someoneBoom;
  @Action('removeCards') removeCards;
  @Action('triggerNopePop') triggerNopePop;

  @Watch('someoneBoom')
  private watchBoom(val) {
    if (val && val === this.user.userId) {
      this.showPositionPop();
    }
  }

  get canShowCards(): boolean {
    return this.selectedCards.length > 0;
  }

  get isGameOver(): boolean {
    return this.gameType === GameInfoType.gameOver;
  }

  // 已出的牌
  get showedCard(): string {
    return this.gameCards && this.gameCards.length > 0 && cardMap[this.gameCards[0]].name || '';
  }

  /**
   * 是否爆炸了的倒霉玩家
   * @param userId 用户id
   */
  isBoomPlayer(userId: string): boolean {
    return userId === this.someoneBoom;
  }

  /**
   * 是否当前出牌玩家
   * @param userId 用户id
   */
  isCurrentPlayer(userId: string): boolean {
    return userId === this.currentPlayer;
  }

  /**
   * 事件源玩家
   * @param userId 用户id
   */
  isOrigin(userId: string): boolean {
    return userId === this.gameOrigin;
  }

  /**
   * 卡牌 class
   * @param index
   */
  cardClass(index: number): string {
    return `card ${this.isSelected(index) ? 'selected' : ''}`
  }

  /**
   * 卡牌被选中了
   * @param index 卡牌序号
   */
  isSelected(index: number): boolean {
    return this.selectedCards.indexOf(index) !== -1;
  }

  /**
   * 摸牌
   */
  touchCard(): void {
    const data: GamePlay = {
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
  selectCard(type: number, index: number): void {
    if (this.waitingDefuse && type !== CardType.defuse) {
      // TODO: 改为toast 吧
      console.log('你要选拆解啊！！！别选其他牌');
      return;
    }

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
  clearSelectedCards(): void {
    this.selectedCards = [];
  }

  /**
   * 想出牌
   */
  wantShowCard(): void {
    if (!this.canShowCards) {
      return;
    }
    const index = this.selectedCards[0];
    const cardType = this.selfGameInfo.cards[index];

    // 等待否决中
    if (this.waitingNope) {
      if (cardType !== CardType.nope || this.selectedCards.length > 1) {
        // TODO: 做成toast
        console.warn('>>> 出牌失败，只能出一张否决');
        return;
      }
      console.log('>>> 否决', this.gameType, this.gameOrigin, this.user.userId);
      if (this.gameOrigin === this.user.userId) {
        // TODO: 做成toast
        console.error('>>> 否决失败，不能否决自己');
        this.selectedCards = [];
      } else if (this.gameType === GameInfoType.play) {
        // 正在出牌，可否决
        this.showCards();
      } else {
        console.error('>>> 否决出错！！！想想为什么');
      }
      return;
    }

    // 不是自己的回合不能出牌
    if (!this.isCurrentPlayer(this.user.userId)) {
      // TODO: 做成toast
      console.warn('>>> 出牌失败，没到你出牌');
      return;
    }

    // 其他牌了

    if (this.selectedCards.length > 1) {
      // TODO: 哇塞，出对子或者多张牌，需要选目标
      console.log('>>>> 出对子啊', this.selectedCards);
      return;
    }
    // TODO: 帮助, 选一名玩家
    if (cardType === CardType.favor) {
      console.log('>>> 帮助');
      // 选玩家
      return;
    }
    if (cardType === CardType.defuse) {
      console.log('>>> 拆解', this.gameType);
      if (this.gameType !== GameInfoType.waitDefuse) {
        console.log('>>> 瞎胡闹，你没爆炸呢，不能拆解');
        return;
      }
      this.showPositionPop();
      return;
    }
    // 其他卡牌直接出吧
    this.showCards();
  }

  /**
   * 出牌吧
   */
  showCards(): void {
    const selectCardTypes = this.selectedCards.map(index => this.selfGameInfo.cards[index]);
    const playType = this.isBoomPlayer(this.user.userId) ? PlayInfoType.soul : PlayInfoType.show;
    const data: GamePlay = {
      id: this.gameId,
      type: playType,
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

  setBoomPosition(): void {
    this.hidePositionPop();
    this.showCards();
  }

  showPositionPop(): void {
    this.positionPopShow = true;
  }

  hidePositionPop(): void {
    this.positionPopShow = false;
  }

  popShowNope(): void {
    const index = this.selfGameInfo.cards.findIndex(c => c === CardType.nope);
    if (index === -1) {
      this.triggerNopePop(false);
      return;
    }
    this.selectedCards = [];
    this.selectedCards.push(index);
    this.showCards();
    this.triggerNopePop(false);
  }

  popRefuseNope(): void {
    const data: GamePlay = {
      id: this.gameId,
      type: PlayInfoType.refuse,
      origin: this.user.userId,
    }
    this.$socketServer.sendPlayData(data);
    console.log('>>>>>>>>发送jujue');
    this.triggerNopePop(false);
  }

  getNickName(userId: string): string {
    const player = this.roomPlayerList.find(p => p.userId === userId);
    return player?.nickName || '';
  }

  getCardName(type: number): string {
    return cardMap[type]?.name || '未知卡牌';
  }

  getCardDesc(type: number): string {
    return cardMap[type]?.desc || '未知卡牌详情';
  }

  /**
   * 退出游戏
   */
  async quitGame(): Promise<void> {
    console.log('>>>>> 退出游戏');
    await this.$socketServer.disconnect();
    this.$router.push(`/match`);
  }
}
