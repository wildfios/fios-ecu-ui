import Vue from 'vue';
import store from '../store';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'port-selector',
      component: require('@/components/PortSelector').default,
      beforeEnter: (to, from, next) => {
        if (store.state.port !== undefined) {
          next('/main');
        } else {
          next();
        }
      }
    },
    {
      path: '/main',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      beforeEnter: (to, from, next) => {
        console.log(store.state.port )
        if (store.state.port !== undefined) {
          next();
        } else {
          next('/');
        }
      }    
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
