import { GameInfo } from '../../../../../../model/game';

export default interface GameState extends GameInfo {
  showPop: boolean;
  nopePopShow: boolean;
  predictPopShow: boolean;
  popTitle: string;
  popText: string;
}

export interface GamePop {
  popTitle: string;
  popText: string;
}
