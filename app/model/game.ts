export interface IPlayer {
  userId: string;
  cards: number[];
  total: number;
  isOver: boolean;
}

export enum GameInfoType {
  system, // 系统消息
  next, // 下一个
  play, // 出牌
  boom, // 爆炸
}

// 服务端下发游戏消息
export interface IGameInfo {
  id: string;
  type: GameInfoType; // 游戏消息类型
  remain: number; // 剩余牌数
  origin?: string; // 事件发起者
  target?: string; // 事件目标
  cards?: number[]; // 出牌类型
  playerList: IPlayer[];
  currentPlayer: string;
}

export enum PlayInfoType {
  touch, // 摸牌
  show, // 出牌
}

// 客户端用户提交游戏消息
export interface IGamePlay {
  id: string;
  type: PlayInfoType; // 游戏消息类型
  origin: string; // 事件发起者
  target?: string; // 事件目标
  cards?: number[]; // 出牌类型
}
