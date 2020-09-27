'use strict';
import App from '@framework/app';
import createStore from '@store/index';
import createRouter from '@router/index';
import entry from '@view/entry/index.vue';
export default new App({ entry, createStore, createRouter }).bootstrap();
