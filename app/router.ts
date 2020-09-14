
import { Application } from 'egg';

export default (application: Application) => {
  const { router, controller } = application;
  router.post('/api/article/list', controller.home.list);
  router.post('/api/article/add', controller.home.add);
  router.post('/api/article/del', controller.home.del);
  router.get('/api/article/:id', controller.home.detail);
  router.get('/api/user/:id', controller.user.getUserById);
  router.get('/', controller.home.game);
};