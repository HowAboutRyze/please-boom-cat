export interface Player {
  userId: string;
  cards: number[];
  total: number;
  isOver: boolean;
}

export enum GameInfoType {
  system, // 系统消息
  next, // 下一个
  play, // 出牌
  skillFail, // 释放技能失败（被否决了）
  predict, // 预言中
  boom, // 爆炸
  waitDefuse, // 等待拆解
  gameOver, // 游戏结束
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
  playerList: Player[];
  currentPlayer: string;
  predictCards: number[]; // 预言卡牌
}

export enum PlayInfoType {
  touch, // 摸牌
  show, // 出牌
  soul, // 灵魂放炸弹猫
  refuse, // 拒绝否决
}

// 客户端用户提交游戏消息
export interface GamePlay {
  id: string; // 游戏 id
  type: PlayInfoType; // 游戏消息类型
  origin: string; // 事件发起者
  target?: string; // 事件目标玩家
  cards?: number[]; // 出的牌
  position?: number; // 放爆炸牌的位置
}

export interface SocketServerConfig {
  initCardNum: number;
  roomSize: number;
}

export interface Socekt {
  id: string;
  [key: string]: any;
}
