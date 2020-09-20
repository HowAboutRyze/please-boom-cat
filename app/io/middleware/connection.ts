import { Context } from 'egg';

export default () => {
  return async (ctx: Context, next) => {
    // 刚连接上
    const { app, socket, helper } = ctx;
    const { socketServer } = app;
    const query = socket.handshake.query;
    const { now, ...userInfo } = query;
    const id = socket.id;

    console.log('>>>>>>>user info', now, id, userInfo);
    socketServer.onSocketConnect(socket, userInfo);

    await next();

    // 断开连接
    socketServer.onSocketDisconnect(socket);
  };
};