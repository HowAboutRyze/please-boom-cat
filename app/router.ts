
import { Application } from 'egg';

export default (application: Application) => {
  const { router, controller } = application;

  // 用户信息
  router.get('/api/user/:id', controller.user.getUserById);
  router.post('/api/user/save', controller.user.saveUser);

  // 页面相关
  router.get('/', controller.home.game);
  router.get('/*', controller.home.game);
};
