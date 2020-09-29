
export interface User {
  userId: string;
  avatar: string;
  nickName: string;
}

export interface RoomInfo {
  id: string;
  masterId: string;
  playerList: User[];
  hasStarted: boolean;
}
