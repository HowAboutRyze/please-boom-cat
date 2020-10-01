import UserState from './modules/user/state';
import GameState from './modules/game/state';
import { RoomInfo } from '../../../../model/room';

export default interface RootState {
  origin: string;
  csrf: string;
  user: UserState;
  room: RoomInfo;
  game: GameState;
}
