import Vue from 'vue';
import { Store } from 'vuex';
import {
  SOCKET_ROOM_BROADCAST,
  SOCKET_START_GAMER,
  SOCKET_JOIN_ROOM,
  SOCKET_RECONNECT,
  SOCKET_GAMER_INFO,
  SOCKET_GAMER_PLAY,
  SOCKET_DISCONNECT,
  CardType,
} from '../../../app/lib/constant';
import { GamePlay, GameInfo, GameInfoType } from '../../model/game';
import { ReconnectMsg } from '../../model/room';
import User from '../../model/user';
import { SET_PLAYER_LIST } from '@store/modules/game/type';

export class Socket {
  public store: Store<any>;

  public socket: any;

  constructor(store: Store<any>) {
    this.store = store;
    this.socket = null;
  }

  public connect(userInfo: User): void {
    if (!EASY_ENV_IS_NODE && (window as any).io) {
      const socket = (window as any).io?.('/', {
        query: {
          now: Date.now(),
          ...userInfo,
        },
        transports: ['websocket']
      });
      socket.on('connect', () => {
        console.log('#connect');
        if (!this.store.state.room.id) {
          this.socket.emit(SOCKET_JOIN_ROOM);
        }

        // 房间广播
        socket.on(SOCKET_ROOM_BROADCAST, data => {
          console.log('>>>>> 房间消息：', data);
          this.store.dispatch('saveRoom', data);
        });

        socket.on('disconnect', () => {
          console.log('>>> 断开连接');
        });

        // 游戏消息
        socket.on(SOCKET_GAMER_INFO, async (data: GameInfo) => {
          console.log('>>>>> 游戏消息：', data);
          // TODO: 判断服务端发送过来的 data.type 进行游戏操作
          const { type } = data;
          switch (type) {
            case GameInfoType.system: {
              this.store.dispatch('saveGame', data);
              break;
            }
            case GameInfoType.next: {
              this.store.dispatch('saveGame', data);
              break;
            }
            case GameInfoType.play: {
              // TODO: 玩家出牌
              this.store.dispatch('saveGame', data);
              console.log('>>> 出牌', data.cards && data.cards.length > 0 && CardType[data.cards[0]]);
              break;
            }
            case GameInfoType.skillFail: {
              // 释放技能失败（被否决了）
              console.log('>>>> socket监听到释放技能失败');
              this.store.dispatch('saveGame', data);
              break;
            }
            case GameInfoType.favoring: {
              // 帮助
              console.log('>>>> socket监听到帮助中');
              this.store.dispatch('saveGame', data);
              break;
            }
            case GameInfoType.boom: {
              // 玩家爆炸，开始插爆炸牌
              this.store.dispatch('playerBoom', data);
              break;
            }
            case GameInfoType.waitDefuse: {
              // 等待玩家拆解
              console.log('>>>> 拆解');
              this.store.dispatch('waitDefuse', data);
              break;
            }
            case GameInfoType.statusChange: {
              // 等待玩家拆解
              console.log('>>>> 玩家状态变更', data);
              this.store.commit(SET_PLAYER_LIST, data.playerList);
              break;
            }
            case GameInfoType.gameOver: {
              // 游戏结束了
              this.store.dispatch('gameOver', data);
              break;
            }
            default: {
              this.store.dispatch('saveGame', data);
            }
          }
        });
      });

      socket.on('reconnect', data => {
        console.log('reconnect', data);
        const msg: ReconnectMsg = {
          userId: this.store.state.user.user.userId,
          roomId: this.store.state.room.id,
        };
        this.socket.emit(SOCKET_RECONNECT, msg);
      });

      this.socket = socket;
      Vue.prototype.$socket = socket;
    }
  }

  public async startGame(): Promise<void> {
    await this.socket?.emit(SOCKET_START_GAMER);
  }

  public async sendPlayData(data: GamePlay): Promise<void> {
    await this.socket?.emit(SOCKET_GAMER_PLAY, data);
  }

  public async disconnect(): Promise<void> {
    await this.socket?.emit(SOCKET_DISCONNECT);
    // 清空房间和游戏数据
    this.store.dispatch('quitRoom');
    this.store.dispatch('quitGame');
  }
}

export default Socket;
