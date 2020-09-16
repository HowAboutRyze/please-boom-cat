import Vue from 'vue';

export class Socket {
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
        const id = socket.id;
    
        console.log('#connect,', id, socket);
    
        // 监听自身 id 试试
        socket.on(id, msg => {
          console.log('#receive,', msg);
        });
      });
      Vue.prototype.$socket = socket;
    }
  }
}

export default new Socket();