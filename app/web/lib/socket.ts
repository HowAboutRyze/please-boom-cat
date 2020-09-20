import Vue from 'vue';
import { ROOM_BROADCAST, START_GAMER } from '../../../app/lib/constant';

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
    
        socket.on(ROOM_BROADCAST, data => {
          console.log('>>>>> 房间消息：', data);
          this.store.dispatch('saveRoom', data);
        });
      });
      
      this.socket = socket;
      Vue.prototype.$socket = socket;
    }
  }

  public startGame(playerList) {
    this.socket?.emit(START_GAMER, { playerList });
  }

  disconnect() {
    this.socket?.disconnect();
    this.store.dispatch('quitRoom');
  }
}

export default Socket;