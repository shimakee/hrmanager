import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

//importing routes, axios, & store frontend
import {store} from './store/store';
import {routes} from './routes/router';

Vue.use(VueRouter);
export const router = new VueRouter({ //creating router instance
  routes: routes,
  mode: 'history',
});

// router.beforeEach((to, from, next)=>{
//   console.log('to', to);
//   console.log('from', from);

  
//   next();
// // });

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
});
