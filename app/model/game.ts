export interface IPlayer {
  userId: string;
  cards: number[];
  total: number;
  isOver: boolean;
}

export enum InfoType {
  system, // 系统消息
  next, // 下一个
  play, // 出牌
  boom, // 爆炸
}

export interface IGameInfo {
  id: string;
  type: InfoType;
  remain: number;
  origin?: string; // 事件发起者
  target?: string; // 事件目标
  cardType?: number; // 出牌类型
  playerList: IPlayer[];
  currentPlayer: string;
}
