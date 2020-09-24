import { SOCKET_GAMER_INFO, CardType, cardMap } from '../lib/constant';
import { IGameInfo, GameInfoType, IGamePlay, PlayInfoType } from '../model/game';
import { uuidv4 } from '../lib/utils';
import * as _ from 'lodash';

export interface IGamePlayer {
  userId: string;
  cards: number[];
  isOver: boolean;
  user: any;
}

export default class Game {
  public gameInfo: any;

  public config: any;

  public id: string;

  public roomId: string;

  // 牌组，只放卡牌类型就行了
  public deck: number[];

  // 额外牌组，初始化的时候存炸弹
  public extDeck: number[];

  public playerList: IGamePlayer[];

  public currentPlayer: string;

  constructor(gameInfo, config) {
    this.gameInfo = gameInfo;
    this.config = config;
    this.id = uuidv4();
    this.roomId = gameInfo.roomId;
    this.deck = [];
    this.extDeck = [];
    this.playerList = gameInfo.playerList;

    this.initGame();
  }

  // 牌组剩余数量
  get total() {
    return this.deck.length;
  }

  // 存活的玩家
  get survivePlayers() {
    return this.playerList.filter(p => !p.isOver);
  }

  /**
   * 初始化游戏
   */
  public initGame() {
    const playerNum = this.playerList.length;
    // for (let i = 0; i <= CardType.beardcat; i++) {
    for (let i = 0; i <= CardType.attack; i++) { // 临时牌减少
      const carInfo = cardMap[i];
      const num: number = typeof carInfo.initNum === 'function' ? carInfo.initNum(playerNum) : carInfo.initNum;
      const cards = [];
      for (let n = 1; n <= num; n++) {
        cards.push(i);
      }
      if (i === CardType.boom) {
        this.extDeck = [...this.extDeck, ...cards];
      } else {
        this.deck = [...this.deck, ...cards];
      }
    }
    console.log('>>>> 初始牌堆:', this.deck);
    this.randomDeck();
    const { initCardNum } = this.config;
    this.playerList.forEach(player => {
      // 先每人发 5 张牌
      for (let i = 0; i < initCardNum; i++) {
        if (i === 0) {
          // 第一张先发个拆解
          player.cards.push(CardType.defuse);
        } else {
          player.cards.push(this.deck.shift());
        }
      }
    });

    // 把炸弹放入牌堆洗牌
    this.deck = [...this.deck, ...this.extDeck];
    this.extDeck = [];
    this.randomDeck();
    this.currentPlayer = this.playerList[0].userId;
    console.log('>>>>> 初始化游戏后', this.deck);
  }

  /**
   * 切洗牌堆
   */
  public randomDeck() {
    this.deck = _.shuffle(this.deck);
  }

  /**
   * 摸牌
   */
  public touchCard() {
    return this.deck.shift();
  }

  /**
   * 通过 userId 找到玩家
   * @param userId 
   */
  public getPlayerById(userId) {
    return this.playerList.find(p => p.userId === userId);
  }

  /**
   * 轮到下一个玩家
   */
  public nextPlayerTurn() {
    const survivePlayers = this.survivePlayers;
    const currIndex = survivePlayers.findIndex(p => p.userId === this.currentPlayer);
    if (currIndex === -1) {
      return;
    }
    if (currIndex === survivePlayers.length - 1) {
      this.currentPlayer = survivePlayers[0].userId;
    } else {
      this.currentPlayer = survivePlayers[currIndex + 1].userId;
    }
  }

  /**
   * 发送游戏信息
   */
  public sendGameInfo(info: Partial<IGameInfo> = {}) {
    const { type = GameInfoType.system, origin, target, cards = [] } = info;
    const normalList = this.playerList.map(({ userId, cards, isOver }) => ({ userId, total: cards.length, cards: [], isOver }));
    this.playerList.forEach(player => {
      const socket = player.user.socket;

      const formatPlayerList = normalList.map(p => {
        if (p.userId === player.userId) {
          return { ...p, cards: player.cards };
        }
        return { ...p };
      });
      const data: IGameInfo = {
        id: this.id,
        type,
        remain: this.total,
        origin,
        target,
        cards,
        playerList: formatPlayerList,
        currentPlayer: this.currentPlayer,
      };
      socket.emit(SOCKET_GAMER_INFO, data);
    });

  }

  /**
   * 处理玩家游戏信息
   * @param data 游戏数据
   */
  public gamePlayHandle(data: IGamePlay) {
    const { type } = data;
    if (type === PlayInfoType.touch) {
      this.playerTouchCard(data);
    } else if (type === PlayInfoType.show) {
      // TODO: 出牌
    } else {
      // TODO: 报错！！！没有对应的类型 type
    }
  }

  public playerTouchCard(data: IGamePlay) {
    console.log('>>>>> 摸牌来了');
    const { origin } = data;
    const card = this.touchCard();
    if (card === CardType.boom) {
      console.log('>>> boom 咯');
      const player = this.getPlayerById(origin);
      if (player.cards.includes(CardType.defuse)) {
        // 如果玩家有拆解，等待拆解并插爆炸牌
        this.sendGameInfo({ type: GameInfoType.waitDefuse, origin });
      } else if (this.survivePlayers.length <= 2) {
        // 如果玩家没有拆解，且最后两个玩家，游戏结束
        this.nextPlayerTurn();
        player.isOver = true;
        this.sendGameInfo({ type: GameInfoType.gameOver, origin });
      } else {
        // 玩家凉凉，开始插爆炸牌
        this.sendGameInfo({ type: GameInfoType.boom, origin });
      }
    } else {
      // 摸完牌了，下一个玩家
      this.playerAddCard(origin, [card]);
      this.nextPlayerTurn();
      this.sendGameInfo({ type: GameInfoType.next, origin });
    }
  }

  /**
   * 玩家添加牌
   */
  public playerAddCard(userId: string, cards: CardType[]) {
    const player = this.playerList.find(p => p.userId === userId);
    if (player) {
      player.cards.push(...cards);
      return true;
    } else {
      // TODO: 报错啊！！！！没找到这个用户
      return false;
    }
  }
}