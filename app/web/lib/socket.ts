import Vue from 'vue';
import { SOCKET_ROOM_BROADCAST, SOCKET_START_GAMER, SOCKET_GAMER_INFO, SOCKET_GAMER_PLAY } from '../../../app/lib/constant';
import { IGamePlay } from '../../model/game';

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
        socket.on(SOCKET_GAMER_INFO, data => {
          console.log('>>>>> 游戏消息：', data);
          // TODO: 判断服务端发送过来的 data.type 进行游戏操作
          this.store.dispatch('saveGame', data);
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