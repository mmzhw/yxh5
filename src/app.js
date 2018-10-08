import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import { sync } from 'vuex-router-sync';
import VueLazyload from 'vue-lazyload';
import { createStore } from './store';
import { createRouter } from './router';
import { baseUrl } from './util/index.js';
import titleMixin from './util/title';
import * as filters from './util/filters';
import 'video.js/dist/video-js.min.css';
import './styles/utils/swiper-3.4.2.min.css';
import './styles/jc-mplayer.css';
import './styles/m-index.css';
if (process.browser) {
    const VueAwesomeSwiper = require('vue-awesome-swiper/ssr');
    Vue.use(VueAwesomeSwiper);
}
// let baseUrl = 'https://dxapi.youxiang0210.com';
// axios.defaults.baseURL = 'http://10.0.31.116:8081'
axios.defaults.baseURL = baseUrl; // 生产环境
axios.defaults.headers = {
    'Acces-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
};
axios.defaults.data = {
    clientId: 'jc_youxiang_app',
    secret: '13c5b701c1ef49c0b032ce41b9bec5c2',
    uuid: 'web',
};
axios.interceptors.response.use(res => {
    return res.data;
}, err => {
    return Promise.reject(err);
});
Vue.prototype.axios = axios;

// mixin for handling title
Vue.mixin(titleMixin);

const lazyPath = require('./assets/common/lazy-load.png');
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: lazyPath,
    loading: lazyPath,
    attempt: 1
});

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp () {
  // create store and router instances
    const store = createStore();
    const router = createRouter();

  // sync the router with the vuex store.
  // this registers `store.state.route`
    sync(store, router);

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
    return { app, router, store };
}
