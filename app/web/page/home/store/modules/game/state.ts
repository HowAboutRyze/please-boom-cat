import { IGameInfo } from '../../../../../../model/game';

export default interface GameState extends IGameInfo {
  showPop: boolean;
  popTitle: string;
  popText: string;
}

export interface IGamePop {
  popTitle: string;
  popText: string;
}