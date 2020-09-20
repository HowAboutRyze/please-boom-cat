import Card, { CardType, cardMap } from './card';
import { uuidv4 } from '../lib/utils';
import * as _ from 'lodash';

export interface IGamePlayer {
  userId: string;
  cards: Card[];
  isOver: boolean;
}

export default class Game {
  public gameInfo: any;

  public config: any;

  public id: string;

  // 牌组
  public deck: Card[];

  // 额外牌组
  public extDeck: Card[];

  public playerList: IGamePlayer[];

  constructor(gameInfo, config) {
    this.gameInfo = gameInfo;
    this.config = config;
    this.id = uuidv4();
    this.deck = [];
    this.extDeck = [];
    this.playerList = gameInfo.playerList;

    this.initDeck();
  }

  // 牌组剩余数量
  get total() {
    return this.deck.length;
  }

  /**
   * 初始化牌堆
   */
  public initDeck() {
    const playerNum = this.playerList.length;
    for (let i = 0; i <= CardType.beardcat; i++) {
      const carInfo = cardMap[i];
      const num: number = typeof carInfo.initNum === 'function' ? carInfo.initNum(playerNum) : carInfo.initNum;
      const cards = [];
      for (let n = 1; n <= num; n++) {
        cards.push(new Card({ type: i }));
      }
      if (i === CardType.boom) {
        this.extDeck = [...this.extDeck, ...cards];
      } else {
        this.deck = [...this.deck, ...cards];
      }
    }
    console.log('>>>> 初始牌堆:', this.deck);
    this.randomDeck();
  }

  /**
   * 切洗牌堆
   */
  public randomDeck() {
    this.deck = _.shuffle(this.deck);
    console.log('>>>>> 洗完牌了', this.deck);
  }
}