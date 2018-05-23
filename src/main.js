import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

//importing routes & store frontend
import {store} from './store/store';
import {routes} from './routes/router';

Vue.use(VueRouter);
const router = new VueRouter({ //creating router instance
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
});
