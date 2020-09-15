
import { Application } from 'egg';

export default (application: Application) => {
  const { router, controller } = application;

  // 参考例子
  router.post('/api/article/list', controller.home.list);
  router.post('/api/article/add', controller.home.add);
  router.post('/api/article/del', controller.home.del);
  router.get('/api/article/:id', controller.home.detail);

  // 用户信息
  router.get('/api/user/:id', controller.user.getUserById);

  // 页面相关
  router.get('/', controller.home.game);
};