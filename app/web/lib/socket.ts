import Vue from 'vue';

class Socket {
  public connect(userInfo) {
    if (!EASY_ENV_IS_NODE && (window as any).io) {
      const socket = (window as any).io?.('/', {
        query: {
          userInfo,
        },
        transports: ['websocket']
      });
      socket.on('connect', () => {
        const id = socket.id;
    
        console.log('#connect,', id, socket);
    
        // 监听自身 id 以实现 p2p 通讯
        socket.on(id, msg => {
          console.log('#receive,', msg);
        });
      });
      Vue.prototype.$socket = socket;
    }
  }
}

export default new Socket();