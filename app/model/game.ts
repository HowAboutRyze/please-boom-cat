export interface BasePlayer {
  userId: string;
  avatar: string;
  nickName: string;
  cards: number[];
  isOver: boolean;
  status: PlayerStatus;
}

export interface Player extends BasePlayer {
  total: number;
}

export enum PlayerStatus {
  online, // 在线
  offline, // 掉线
  leave, // 离开
}

export enum GameInfoType {
  system, // 系统消息
  next, // 下一个
  play, // 出牌
  skillFail, // 释放技能失败（被否决了）
  predict, // 预言中
  favoring, // 帮助
  favored, // 已帮助
  steal, // 对子，偷牌
  rob, // 三条，抢劫
  boom, // 爆炸
  waitDefuse, // 等待拆解
  gameOver, // 游戏结束
  statusChange, // 玩家状态变更
}

// 服务端下发游戏消息
export interface GameInfo {
  id: string; // 游戏 id
  msg?: string; // 额外消息
  type: GameInfoType; // 游戏消息类型
  remain: number; // 剩余牌数
  origin?: string; // 事件发起者
  target?: string; // 事件目标
  cards?: number[]; // 出的牌
  waitingNope: boolean; // 等待否决中
  attacking?: boolean; // 攻击中
  playerList: Player[];
  currentPlayer: string;
  predictCards: number[]; // 预言卡牌
}

export enum PlayInfoType {
  touch, // 摸牌
  show, // 出牌
  soul, // 灵魂放炸弹猫
  refuse, // 拒绝否决
  favor, // 帮助
}

// 客户端用户提交游戏消息
export interface GamePlay {
  id: string; // 游戏 id
  type: PlayInfoType; // 游戏消息类型
  origin: string; // 事件发起者
  target?: string; // 事件目标玩家
  cards?: number[]; // 出的牌
  position?: number; // 放爆炸牌的位置
  wishfulCard?: number; // 三张牌，抢劫指定的卡
}

export interface SocketServerConfig {
  initCardNum: number;
  roomSize: number;
}

export interface Socekt {
  id: string;
  [key: string]: any;
}
