import { IGameInfo } from '../../../../../../model/game';

export default interface GameState extends Partial<IGameInfo> {
  showPop: boolean;
  popTitle: string;
  popText: string;
}