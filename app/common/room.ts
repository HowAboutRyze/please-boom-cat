import { PlainObject } from 'egg';
import { uuidv4 } from '../lib/utils';
import { User as TypeUser } from './user';
import { ROOM_BROADCAST } from '../lib/constant';
import { IRoomInfo } from '../model/room';

class RoomServer {
  public config: any;

  public roomList: Array<Room> = [];

  constructor(config) {
    this.config = config;
  }

  /**
   * 新建房间
   * @param room 房间
   * @return id 房间id
   */
  public createRoom() {
    const newRoom = new Room(this.config);
    this.roomList.push(newRoom);
    console.log('>>>>>> create roomList:', this.roomList);
    return newRoom;
  }

  /**
   * 解散房间
   * @param id 房间id
   */
  public removeRoom(id) {
    const index = this.roomList.findIndex(u => u.id === id);
    if (index !== -1) {
      this.roomList.splice(index, 1);
    }
    console.log('>>>>> remove room:', this.roomList);
  }

  /**
   * 通过 id 找房间
   * @param id 房间 id
   */
  public getRoomById(id) {
    const index = this.roomList.findIndex(u => u.id === id);
    return index !== -1 ? this.roomList[index] : null;
  }

  /**
   * 找到可以加入的房间
   * - 有没满人的房间，则返回 room
   * - 新建房间，返回 room
   * @return room
   */
  public findJoinableRoom() {
    const joinableRooms = this.roomList.find(room => room.joinable);
    console.log('>>>> find room', joinableRooms);
    if (joinableRooms) {
      return joinableRooms;
    }
    return this.createRoom();
  }
}

class Room {
  public config: any;

  public id: string;

  // 房主 id
  public masterId: string;

  public playerList: TypeUser[];

  // 开始游戏了
  public hasStarted: boolean;

  constructor(config) {
    this.config = config;
    this.id = uuidv4();
    this.playerList = [];
    this.hasStarted = false;
  }

  // 房间已满？
  get isFull(): boolean {
    return this.playerList.length >= this.config.roomSize;
  }

  // 可加入房间？
  get joinable() {
    return !this.hasStarted && !this.isFull;
  }

  // 房间是空的？
  get isEmpty() {
    return this.playerList.length === 0;
  }

  /**
   * 加玩家
   * @param player 玩家
   */
  public addPlayer(player: TypeUser) {
    if (this.isEmpty) {
      this.masterId = player.userId;
    }
    this.playerList.push(player);
    console.log('>>>>> room add player', this.id, this.playerList);
  }

  /**
   * 移除玩家
   * @param player 玩家
   */
  public removePlayer(player: TypeUser) {
    const index = this.playerList.findIndex(u => u.userId === player.userId);
    if (index !== -1) {
      this.playerList.splice(index, 1);
      // 如果房主被移除了
      // TODO: 什么场景呢？掉线？
      if (this.masterId === player.userId && !this.isEmpty) {
        this.masterId === this.playerList[0].userId;
      }
    }
  }

  /**
   * 更新用户
   * @param player 玩家
   */
  public updatePlayer(player: TypeUser) {
    const index = this.playerList.findIndex(u => u.userId === player.userId);
    if (index !== -1) {
      this.playerList[index] = player;
    }
  }

  /**
   * 向房间广播
   * @param data
   */
  public broadcast() {
    const { id, masterId, hasStarted, playerList } = this;
    const formatPlayerList = playerList.map(({ userId, avatar, nickName }) => ({ userId, avatar, nickName }));
    this.playerList.forEach(player => {
      const data: IRoomInfo = {
        id,
        masterId,
        playerList: formatPlayerList,
        hasStarted,
      };
      player.socket.emit(ROOM_BROADCAST, data);
    });
  }
}

export default RoomServer;
