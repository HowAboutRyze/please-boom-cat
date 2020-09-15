
export default () => {
  return async (ctx, next) => {
    const { app, socket, helper } = ctx;
    const { socketServer } = app;
    const query = socket.handshake.query;
    const { userInfo } = query;
    const id = socket.id;

    console.log('>>>>>>>user info', id, userInfo);
    socketServer.onGetUserInfo(id, userInfo);
    socket.emit(id, {
      id,
      msg: 'I got you'
    });
  };
};