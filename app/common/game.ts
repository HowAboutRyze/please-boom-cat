import { SOCKET_GAMER_INFO, CardType, cardMap } from '../lib/constant';
import { IGameInfo, InfoType } from '../model/game';
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

  /**
   * 初始化游戏
   */
  public initGame() {
    const playerNum = this.playerList.length;
    for (let i = 0; i <= CardType.beardcat; i++) {
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
   * 发送游戏信息
   */
  public sendGameInfo() {
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
        type: InfoType.system,
        remain: this.total,
        playerList: formatPlayerList,
        currentPlayer: this.currentPlayer,
      };
      socket.emit(SOCKET_GAMER_INFO, data);
    });

  }
}