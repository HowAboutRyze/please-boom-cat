import Vue from 'vue';

import VueRouter from 'vue-router';
import Login from '../view/login/index.vue';
import Match from '../view/match/index.vue';
import Game from '../view/game/index.vue';

import { _session } from '@lib/storage';
import { USER_ID } from '@lib/constant';

Vue.use(VueRouter);

export default function createRouter(): VueRouter {
  const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
      {
        path: '/',
        component: Login,
      },
      {
        path: '/match',
        component: Match,
      },
      {
        path: '/game',
        component: Game,
      },
      {
        path: '*', component: () => import('../view/notfound/index.vue'),
      },
    ],
  });
  router.beforeEach((to, from, next) => {
    if (!EASY_ENV_IS_NODE) {
      const hasLogin = _session.get(USER_ID);
      if (to.path !== '/' && !hasLogin) {
        // 未登录就登录咯
        next('/');
      } else if (to.path === '/' && hasLogin) {
        // 登录了就去匹配页啊
        next('/match');
      }
    }
    next();
  })
  return router;
}
