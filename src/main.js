import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
//axios

//importing routes frontend
import {routes} from '../routes/front/router.js';


Vue.use(VueRouter);
const router = new VueRouter({ //creating router instance
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
