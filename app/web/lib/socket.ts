import Vue from 'vue';
import { SOCKET_ROOM_BROADCAST, SOCKET_START_GAMER, SOCKET_GAMER_INFO, SOCKET_GAMER_PLAY } from '../../../app/lib/constant';
import { IGamePlay, IGameInfo, GameInfoType } from '../../model/game';
import { sleep } from './utils';

export class Socket {
  public store: any;

  public socket: any;

  constructor(store) {
    this.store = store;
    this.socket = null;
  }

  public connect(userInfo) {
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
    
        // 房间广播
        socket.on(SOCKET_ROOM_BROADCAST, data => {
          console.log('>>>>> 房间消息：', data);
          this.store.dispatch('saveRoom', data);
        });

        // 游戏消息
        socket.on(SOCKET_GAMER_INFO, async (data: IGameInfo) => {
          console.log('>>>>> 游戏消息：', data);
          // TODO: 判断服务端发送过来的 data.type 进行游戏操作
          const { type, origin } = data;
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
              // this.store.dispatch('', data);
              break;
            }
            case GameInfoType.boom: {
              // TODO: 玩家爆炸，开始插爆炸牌
              // this.store.dispatch('', data);
              break;
            }
            case GameInfoType.waitDefuse: {
              // TODO: 等待玩家拆解
              console.log('>>>> 拆解');
              await this.store.dispatch('showGamePop', { ...data, popTitle: 'Congratulation', popText: `账号 ${origin} 抽到爆炸猫了！！` });
              // this.store.dispatch('', data);
              break;
            }
            case GameInfoType.gameOver: {
              // TODO: 游戏结束了
              // this.store.dispatch('', data);
              break;
            }
            default: {
              this.store.dispatch('saveGame', data);
            }
          }
        });
      });
      
      this.socket = socket;
      Vue.prototype.$socket = socket;
    }
  }

  public async startGame() {
    await this.socket?.emit(SOCKET_START_GAMER);
  }

  public async sendPlayData(data: IGamePlay) {
    await this.socket?.emit(SOCKET_GAMER_PLAY, data);
  }

  public async disconnect() {
    await this.socket?.disconnect();
    this.store.dispatch('quitRoom');
  }
}

export default Socket;