import SocketServer from './app/common/socketServer';

class AppBootHook {
  public app: any;
  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务

    // 挂在 socket 服务
    this.app.socketServer = new SocketServer(this.app);
  }
}

export default AppBootHook;