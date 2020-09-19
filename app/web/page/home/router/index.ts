import Vue from 'vue';

import VueRouter from 'vue-router';
import Login from '../view/login/index.vue';
import Game from '../view/game/index.vue';

import { _session } from '@lib/storage';
import { USER_ID } from '@lib/constant';

Vue.use(VueRouter);

export default function createRouter() {
  const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
      {
        path: '/',
        component: Login
      },
      {
        path: '/game',
        component: Game
      },
      {
        path: '*', component: () => import('../view/notfound/index.vue')
      }
    ]
  });
  router.beforeEach((to, from, next) => {
    const hasLogin = _session.get(USER_ID);
    if (to.path !== '/' && !hasLogin) {
      // 未登录就登录咯
      next('/');
    } else if (to.path === '/' && hasLogin) {
      // 登录了就去游戏页啊
      next('/game');
    }
    next();
  })
  return router;
}
