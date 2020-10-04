'use strict';
import Vue from 'vue';
import App from '@framework/app';
import createStore from '@store/index';
import createRouter from '@router/index';
import entry from '@view/entry/index.vue';
import './reset.css';

if (process.env.NODE_ENV == 'development') {
  Vue.config.devtools = true;
} else {
  Vue.config.devtools = false;
}
export default new App({ entry, createStore, createRouter }).bootstrap();
