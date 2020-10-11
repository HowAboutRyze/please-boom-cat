import { SOCKET_GAMER_INFO, CardType, cardMap } from '../lib/constant';
import { User as TypeUser } from './user';
import {
  BasePlayer,
  GameInfo,
  GameInfoType,
  GamePlay,
  PlayerStatus,
  PlayInfoType,
  SocketServerConfig,
} from '../model/game';
import { uuidv4, randomInt } from '../lib/utils';
import * as _ from 'lodash';

interface SkillStore {
  canUse: boolean; // 能使用，仅否决可改
  skill: () => void; // 卡牌技能
}

export interface GamePlayer extends BasePlayer {
  user: TypeUser;
}

export interface GameData {
  roomId: string;
  playerList: GamePlayer[];
}

export default class Game {
  public gameData: GameData;

  public config: SocketServerConfig;

  public id: string;

  public roomId: string;

  // 牌组，只放卡牌类型就行了
  public deck: number[];

  // 额外牌组，初始化的时候存炸弹
  public extDeck: number[];

  public playerList: GamePlayer[];

  public currentPlayer: string;

  public waitingNope: boolean;

  // 等待否决 timeout
  private waitNopeTimer: any;

  // 技能存储
  private skillStore: SkillStore | null;

  // 拥有否决的用户
  private playersHaveNope: string[];

  // 玩家被攻击中
  private attacking: boolean;

  constructor(gameData: GameData, config: SocketServerConfig) {
    this.gameData = gameData;
    this.config = config;
    this.id = uuidv4();
    this.roomId = gameData.roomId;
    this.deck = [];
    this.extDeck = [];
    this.playerList = gameData.playerList;
    this.waitingNope = false;
    this.attacking = false;
    this.playersHaveNope = [];

    this.initGame();
  }

  // 牌组剩余数量
  get total(): number {
    return this.deck.length;
  }

  // 存活的玩家
  get survivePlayers(): GamePlayer[] {
    return this.playerList.filter(p => !p.isOver && p.status !== PlayerStatus.leave);
  }

  /**
   * 初始化游戏
   */
  public initGame(): void {
    const playerNum = this.playerList.length;
    for (let i = 0; i <= CardType.beardcat; i++) {
    // for (let i = 0; i <= CardType.future; i++) { // FIXME: 临时把牌减少用于开发
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
  public randomDeck(): void {
    this.deck = _.shuffle(this.deck);
    console.log('>>>> 洗牌后', this.deck);
  }

  /**
   * 摸牌
   */
  public touchCard(): number {
    return this.deck.shift();
  }

  /**
   * 通过 userId 找到玩家
   * @param userId
   */
  public getPlayerById(userId: string): GamePlayer {
    return this.playerList.find(p => p.userId === userId);
  }

  /**
   * 轮到下一个玩家
   */
  public nextPlayerTurn(): void {
    if (this.attacking) {
      // 被攻击中，则不到下一个玩家
      this.attacking = false;
      return;
    }
    const survivePlayers = this.survivePlayers;
    const currIndex = survivePlayers.findIndex(p => p.userId === this.currentPlayer);
    if (currIndex === -1) {
      return;
    }
    if (currIndex === survivePlayers.length - 1 || survivePlayers.length === 1) {
      // 如果是最后一个，或者幸存者只有一个了，那下一个只有他咯
      this.currentPlayer = survivePlayers[0].userId;
    } else {
      this.currentPlayer = survivePlayers[currIndex + 1].userId;
    }
  }

  /**
   * 发送游戏信息
   * @param info
   */
  public sendGameInfo(info: Partial<GameInfo> = {}): void {
    const { type = GameInfoType.system, msg = '', origin, target = '', cards = [] } = info;
    const normalList = this.playerList.map(({ userId, cards, isOver, status }) => ({ userId, total: cards.length, cards: [], isOver, status }));
    const isPredict = type === GameInfoType.predict;
    this.playerList.forEach(player => {
      const socket = player.user.socket;
      if (player.status === PlayerStatus.leave) {
        // 主动离开房间的就不再发消息了
        return;
      }

      const formatPlayerList = normalList.map(p => {
        if (p.userId === player.userId) {
          return { ...p, cards: player.cards };
        }
        return { ...p };
      });
      // 预言中会给他前三张牌
      const predictCards = isPredict && player.userId === origin ? this.deck.slice(0, 3) : [];
      const data: GameInfo = {
        id: this.id,
        msg,
        type,
        remain: this.total,
        origin,
        target,
        cards,
        waitingNope: this.waitingNope,
        playerList: formatPlayerList,
        currentPlayer: this.currentPlayer,
        predictCards: predictCards,
      };
      socket.emit(SOCKET_GAMER_INFO, data);
    });

  }

  /**
   * 处理玩家游戏信息
   * @param data 游戏数据
   */
  public gamePlayHandle(data: GamePlay): void {
    const { type } = data;
    if (type === PlayInfoType.touch) {
      this.playerTouchCard(data);
    } else if (type === PlayInfoType.show) {
      this.playerShowCard(data);
    } else if (type === PlayInfoType.soul) {
      this.soulSetBoomPosition(data);
    } else if (type === PlayInfoType.refuse) {
      this.refuseNope(data);
    } else if (type === PlayInfoType.favor) {
      this.favorCard(data);
    } else {
      // TODO: 报错！！！没有对应的类型 type
    }
  }

  /**
   * 玩家摸牌
   * @param data
   */
  public playerTouchCard(data: GamePlay): void {
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
        if (this.attacking) {
          this.attacking = false;
        }
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
   * 玩家出牌
   * @param data
   */
  public playerShowCard(data: GamePlay): void {
    const { origin, target, cards, position, wishfulCard } = data;
    if (cards.length === 0) {
      // TODO: 报错啊，都没牌，出什么？
      console.error('没牌出啊？');
      return;
    }

    // 初始化数据
    this.playersHaveNope = this.getPlayersHaveNope(origin);
    // FIXME: 先删掉玩家的牌没问题吧？
    this.playerRemoveCard(origin, cards);
    const card = cards[0];
    if (cards.length > 1) {
      if (cards.length === 2) {
        // 对子
        console.log('>>>> 出对子，偷一张卡');
        this.waitReleaseSkill(data, () => {
          this.stealCard(origin, target);
          this.sendGameInfo({ type: GameInfoType.system, origin });
        });
      } else if (cards.length > 2) {
        // 三张，指定要玩家一张卡，没有就没有咯
        console.log('>>>> 出三张，指定要一张卡');
        this.waitReleaseSkill(data, () => {
          this.robCard(origin, target, wishfulCard);
          this.sendGameInfo({ type: GameInfoType.system, origin });
        });
      }
      return;
    }

    // 否决锁，在等待否决期间其他牌都不能出，只能出否决
    this.waitingNope = true;
    if (card === CardType.defuse) {
      // 拆解
      this.waitingNope = false; // 关闭否决锁
      // 插一张爆炸猫
      this.deck.splice(position, 0, CardType.boom);
      this.nextPlayerTurn();
      this.sendGameInfo({ type: GameInfoType.next, origin, msg: `玩家 ${origin} 拆解了炸弹` });
    } else if (card === CardType.skip) {
      // 跳过
      this.waitReleaseSkill(data, () => {
        this.nextPlayerTurn();
        this.sendGameInfo({ type: GameInfoType.next, origin });
      });
    } else if (card === CardType.nope) {
      // 否决
      clearTimeout(this.waitNopeTimer);
      if (!this.skillStore) {
        return;
      }
      this.skillStore.canUse = !this.skillStore.canUse;
      this.waitReleaseSkill(data, null);
    } else if (card === CardType.shuffle) {
      // 切洗
      this.waitReleaseSkill(data, () => {
        this.randomDeck();
        // 通知解锁否决
        this.sendGameInfo({ type: GameInfoType.system, origin });
      });
    } else if (card === CardType.attack) {
      // 攻击
      this.waitReleaseSkill(data, () => {
        // 玩家被攻击时出攻击牌，立即解除被攻击状态
        this.attacking = false;
        // 到下一个玩家，并增加攻击状态
        this.nextPlayerTurn();
        this.attacking = true;
        this.sendGameInfo({ type: GameInfoType.next, origin });
      });
    } else if (card === CardType.future) {
      // 先知
      this.waitReleaseSkill(data, () => {
        this.sendGameInfo({ type: GameInfoType.predict, origin });
      });
    } else if (card === CardType.favor) {
      // 帮助
      this.waitReleaseSkill(data, () => {
        this.sendGameInfo({ type: GameInfoType.favoring, origin, target });
      });
    } else {
      this.sendGameInfo({ type: GameInfoType.play, origin });
    }
  }

  /**
   * 爆炸了的灵魂放炸弹猫
   * @param data
   */
  public soulSetBoomPosition(data: GamePlay): void {
    const { origin, position } = data;
    this.deck.splice(position, 0, CardType.boom);
    this.nextPlayerTurn();
    const player = this.getPlayerById(origin);
    player.isOver = true;
    this.sendGameInfo({ type: GameInfoType.next, origin, msg: `玩家 ${origin} 爆炸凉凉，到下一个` });
  }

  /**
   * 玩家添加牌
   * @param userId
   * @param cards 添加的卡牌们
   */
  public playerAddCard(userId: string, cards: CardType[] = []): boolean {
    const player = this.getPlayerById(userId);
    if (player) {
      player.cards.push(...cards);
      return true;
    } else {
      // TODO: 报错啊！！！！没找到这个用户
      return false;
    }
  }

  /**
   * 玩家失去牌
   * @param userId
   * @param cards
   */
  public playerRemoveCard(userId: string, cards: CardType[] = []): boolean {
    const player = this.getPlayerById(userId);
    if (player) {
      const targetCards = [...cards];
      const resCards = player.cards.reduce((group, currCard) => {
        if (targetCards.includes(currCard)) {
          targetCards.shift();
          return group;
        }
        return [...group, currCard];
      }, []);
      player.cards = resCards;
      return true;
    } else {
      // TODO: 报错啊！！！！没找到这个用户
      return false;
    }
  }

  /**
   * 偷一张卡
   * @param origin 偷卡人
   * @param target 被偷卡人
   */
  public stealCard(origin: string, target: string): boolean {
    const originPlayer = this.getPlayerById(origin);
    const targetPlayer = this.getPlayerById(target);
    if (originPlayer && targetPlayer) {
      const maxIndex = targetPlayer.cards.length - 1;
      if (maxIndex === -1) {
        console.log('>>>> 偷卡技能对手没有卡啊');
      } else {
        const cardIndex = randomInt(0, maxIndex);
        const cards = targetPlayer.cards.splice(cardIndex, 1);
        originPlayer.cards.push(...cards);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * 抢牌
   * @param origin 抢牌人
   * @param target 被抢牌人
   * @param card 要抢的牌
   */
  public robCard(origin: string, target: string, card: number): boolean {
    const originPlayer = this.getPlayerById(origin);
    const targetPlayer = this.getPlayerById(target);
    if (originPlayer && targetPlayer) {
      const cardIndex = targetPlayer.cards.indexOf(card);
      if (cardIndex === -1) {
        console.log('>>>> 三张牌指定的对手没有指定的卡');
      } else {
        const cards = targetPlayer.cards.splice(cardIndex, 1);
        originPlayer.cards.push(...cards);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * 等待释放卡牌技能
   * @param data 数据
   * @param skill 技能
   */
  public waitReleaseSkill(data: GamePlay, skill: () => void): void {
    const { origin, target, cards } = data;
    // 通知其他人出牌了
    this.sendGameInfo({ type: GameInfoType.play, origin, target, cards });

    // 保存上一张卡牌技能（不保存否决）
    if (cards.length !== 1 || cards[0] !== CardType.nope) {
      this.skillStore = { canUse: true, skill };
    }

    // 1. 如果有人有否决牌，等 5s 确认
    // 2. 没人有否决牌，等待 1.5 ~ 2.5s，到下一家
    const delayTime = this.playersHaveNope.length > 0 ? 5000 : randomInt(1500, 3000);
    console.log('>>> 释放技能', this.playersHaveNope);
    this.waitNopeTimer = setTimeout(() => {
      this.startReleaseSkill(origin);
    }, delayTime);

  }

  /**
   * 开始释放技能
   */
  public startReleaseSkill(origin: string): void {
    clearTimeout(this.waitNopeTimer);
    // 关闭等待否决
    this.waitingNope = false;
    console.log('>>> 能不能释放技能：', this.skillStore?.canUse);
    // 最后能释放技能
    if (this.skillStore?.canUse) {
      this.skillStore.skill();
      this.skillStore = null;
    } else {
      // 最后不能释放技能，通知大家解锁
      this.sendGameInfo({ type: GameInfoType.skillFail, origin });
    }
  }

  /**
   * 获取拥有否决牌的玩家
   * @param userId 当前玩家
   */
  public getPlayersHaveNope(userId: string): string[] {
    const players = [];
    this.playerList.forEach(player => {
      if (player.userId !== userId && player.cards.includes(CardType.nope)) {
        players.push(player.userId);
      }
    });
    return players;
  }

  /**
   * 拒绝否决
   * @param data 游戏信息
   * 从拥有否决的玩家集合中移除拒绝否决的玩家，所有人拒绝否决，则执行技能
   */
  public refuseNope(data: GamePlay): void  {
    const { origin } = data;
    const index = this.playersHaveNope.findIndex(p => p === origin);
    if (index === -1) {
      console.log('>>> 拒绝否决失败,你拒绝过,或者没有否决');
      return;
    }
    this.playersHaveNope.splice(index, 1);
    if (this.playersHaveNope.length === 0 && this.skillStore?.canUse) {
      console.log('>>>所有人拒绝否决，释放技能<<<<<');
      this.startReleaseSkill(origin);
    }
  }

  /**
   * 帮助
   * @param data 游戏信息
   */
  public favorCard(data: GamePlay): void {
    const { origin, target, cards } = data;
    if (cards.length === 0) {
      return;
    }
    this.playerRemoveCard(origin, cards);
    this.playerAddCard(target, cards);
    this.sendGameInfo({ type: GameInfoType.system, origin: target });
  }
}
