import Vue from 'vue';
import { ROOM_BROADCAST } from '../../../app/lib/constant';

export class Socket {
  public store: any;

  constructor(store) {
    this.store = store;
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
      
      Vue.prototype.$socket = socket;
    }
  }
}

export default Socket;