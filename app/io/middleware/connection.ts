
export default () => {
  return async (ctx, next) => {
    // 刚连接上
    const { app, socket, helper } = ctx;
    const { socketServer } = app;
    const query = socket.handshake.query;
    const { now, ...userInfo } = query;
    const id = socket.id;

    console.log('>>>>>>>user info', now, id, userInfo);
    socketServer.onGetUserInfo(socket, userInfo);

    // 给他返回一条消息试试
    socket.emit(id, {
      id,
      msg: 'I got you'
    });

    await next();

    // 断开连接
    socketServer.onSocketDisconnect(socket);
  };
};