import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Getter, Action } from 'vuex-class';
import { cardMap, CardType } from '../../../../../lib/constant';
import { GamePlay, PlayerStatus, PlayInfoType, GameInfoType } from '../../../../../model/game';
import CmpUserInfo from '../../component/cmpUserInfo/index.vue';
import CmpCard from '../../component/cmpCard/index.vue';
import RootState from '@store/state';

@Component({
  components: {
    CmpUserInfo,
    CmpCard,
  },
})
export default class Game extends Vue {
  public selectedCards: number[] = [];
  public position = 0;
  public targetPlayer = '';
  public winnerNickName = '';
  public winnerAvatar = '';
  public positionPopShow  = false;
  public targetPopShow  = false;
  public wishPopShow  = false;
  public wishfulCard: number | null = null;
  public allCards = Object.keys(cardMap).slice(1);

  @State((state: RootState) => state.user.user) user;
  @State((state: RootState) => state.game.id) gameId;
  @State((state: RootState) => state.game.type) gameType;
  @State((state: RootState) => state.game.origin) gameOrigin;
  @State((state: RootState) => state.game.target) gameTarget;
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
  @Getter('someoneFavor') someoneFavor;
  @Getter('favoringCard') favoringCard;
  @Getter('favored') favored;
  @Getter('wasFavored') wasFavored;
  @Getter('stealSuccess') stealSuccess;
  @Getter('wasStealed') wasStealed;
  @Action('removeCards') removeCards;
  @Action('triggerNopePop') triggerNopePop;

  @Watch('someoneBoom')
  private watchBoom(val) {
    if (val && val === this.user.userId) {
      this.showPositionPop();
    }
  }

  @Watch('favored')
  private watchFavored(val) {
    if (val) {
      this.$toast({ message: `你帮助了 “${this.getNickName(this.gameTarget)}”` });
    }
  }

  @Watch('wasFavored')
  private watchWasFavored(val) {
    if (val) {
      const card = this.gameCards[0];
      this.$toast({ message: `“${this.getNickName(this.gameOrigin)}” 帮助了你一张 “${this.getCardName(card)}”` });
    }
  }

  @Watch('stealSuccess')
  private watchStealSuccess(val) {
    if (val) {
      if (!this.gameCards || !this.gameCards.length) {
        this.$toast({ message: '你的对子啥也没偷到' });
        return;
      }
      const card = this.gameCards[0];
      this.$toast({ message: `你的对子得到了 “${this.getCardName(card)}”` });
    }
  }

  @Watch('wasStealed')
  private watchWasStealed(val) {
    if (val) {
      if (!this.gameCards || !this.gameCards.length) {
        this.$toast({ message: `“${this.getNickName(this.gameOrigin)}” 的对子从你这偷了个寂寞` });
        return;
      }
      const card = this.gameCards[0];
      this.$toast({ message: `“${this.getNickName(this.gameOrigin)}” 的对子偷了你一张 “${this.getCardName(card)}”` });
    }
  }

  @Watch('isGameOver')
  private watchGameOver(val) {
    if (val && val === true) {
      // 游戏结束，记录获胜玩家
      this.winnerNickName = this.getNickName(this.currentPlayer);
      this.winnerAvatar = this.getAvatar(this.currentPlayer);
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
    if (this.gameCards && this.gameCards.length > 0) {
      const name = cardMap[this.gameCards[0]].name;
      if (this.gameCards.length === 2) {
        return `对子：${name}`;
      } else if (this.gameCards.length > 2) {
        return `三张：${name}`;
      }
      return name;
    }
    return '';
  }

  get showTouch(): boolean {
    return !this.canShowCards && this.isCurrentPlayer(this.user.userId) && !this.waitingDefuse
      && !this.waitingNope && this.gameType !== GameInfoType.favoring;
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
   * 事件目标玩家
   * @param userId 用户id
   */
  isTarget(userId: string): boolean {
    return this.gameTarget && userId === this.gameTarget;
  }

  /**
   * 选中的事件目标
   * @param userId 玩家id
   */
  isTargetPlayer(userId: string): boolean {
    return userId === this.targetPlayer;
  }

  /**
   * 是想要的牌
   * @param card
   */
  isWishfulCard(card: number): boolean {
    return card === this.wishfulCard;
  }

  /**
   * 是否掉线
   * @param status 玩家状态
   */
  isOffline(status: PlayerStatus): boolean {
    return status !== PlayerStatus.online;
  }

  /**
   * 掉线文案
   * @param status 玩家状态
   */
  offlineText(status: PlayerStatus): string {
    return status === PlayerStatus.offline ? '（掉线了）' : '（已退出房间）';
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
    if (this.waitingNope) {
      console.log('>>>> 摸牌失败，等待否决中');
      return;
    }
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
    if (this.waitingDefuse && type !== CardType.defuse && this.isCurrentPlayer(this.user.userId)) {
      this.$toast.fail('你只能出拆解');
      return;
    }

    const cardMessage = `【${this.getCardName(type)}】${this.getCardDesc(type)}`;

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
      this.$toast({ message: cardMessage });
    } else {
      // 没选过牌，选牌
      this.selectedCards.push(index);
      this.$toast({ message: cardMessage });
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
        this.$toast.fail('出牌失败，只能出一张否决');
        return;
      }
      console.log('>>> 否决', this.gameType, this.gameOrigin, this.user.userId);
      if (this.gameOrigin === this.user.userId) {
        this.$toast.fail('否决失败，不能否决自己');
        this.selectedCards = [];
      } else if (this.gameType === GameInfoType.play) {
        // 正在出牌，可否决
        this.showCards();
      } else {
        this.$toast.fail('否决出错！！！想想为什么');
      }
      return;
    }

    // 不是自己的回合不能出牌
    if (!this.isCurrentPlayer(this.user.userId)) {
      this.$toast.fail('出牌失败，没到你出牌');
      return;
    }

    // 其他牌了

    if (this.selectedCards.length > 1) {
      // 出对子或者多张牌，选目标
      console.log('>>>> 出对子或者三张牌啊', this.selectedCards);
      this.showTargetPop();
      return;
    }
    if (cardType === CardType.favor) {
      console.log('>>> 帮助');
      // 选玩家
      this.showTargetPop();
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
    if (this.wishfulCard) {
      data.wishfulCard = Number(this.wishfulCard);
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

  showWishPop(): void {
    this.wishPopShow = true;
  }

  hideWishPop(): void {
    this.wishPopShow = false;
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

  // 帮助别人一张卡
  favorCard(): void {
    // 一张
    const selectCardTypes = this.selectedCards.map(index => this.selfGameInfo.cards[index]);
    if (selectCardTypes.length === 0) {
      console.log('>>>> 请选择一张牌');
      return;
    }
    const selectCardType = selectCardTypes[0];
    const data: GamePlay = {
      id: this.gameId,
      type: PlayInfoType.favor,
      origin: this.user.userId,
      target: this.gameOrigin,
      cards: [selectCardType],
    }
    this.$socketServer.sendPlayData(data);

    this.removeCards([selectCardType]);

    this.clearSelectedCards();
  }

  setTarget(): void {
    if (!this.targetPlayer) {
      this.$toast({ message: '必须选择一名玩家哦！' });
      return;
    }
    this.hideTargetPop();
    if (this.selectedCards.length > 2) {
      // 出三张牌
      this.showWishPop();
    } else {
      this.showCards();
      this.targetPlayer = '';
    }
  }

  setWishfulCard(): void {
    if (this.wishfulCard === null) {
      this.$toast({ message: '必须选择一张你想要的卡哦！' });
      return;
    }
    this.hideWishPop();
    this.showCards();
    this.wishfulCard = null;
    this.targetPlayer = '';
  }

  /**
   * 选择一个玩家
   * @param userId 玩家id
   */
  selectTarget(userId: string, isOver: boolean): void {
    if (isOver) {
      console.log('>>>> 都提示你不能选尸体咯');
      return;
    }
    this.targetPlayer = userId;
  }

  /**
   * 选择想要的牌
   * @param card
   */
  selectWishfulCard(card: number): void {
    this.wishfulCard = card;
  }

  /**
   * 清空选择玩家
   */
  cleartargetPlayer(): void {
    this.targetPlayer = '';
  }

  showTargetPop(): void {
    this.targetPopShow = true;
  }

  hideTargetPop(): void {
    this.targetPopShow = false;
  }

  getNickName(userId: string): string {
    const player = this.roomPlayerList.find(p => p.userId === userId);
    return player?.nickName || '';
  }

  getAvatar(userId: string): string {
    const player = this.roomPlayerList.find(p => p.userId === userId);
    return player?.avatar || '';
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
    this.$router.push('/match');
  }
}
