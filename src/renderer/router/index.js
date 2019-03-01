import Vue from 'vue';
import SerialComm from '../services/SerialComm';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'port-selector',
      component: require('@/components/PortSelector').default,
      beforeEnter: (to, from, next) => {
        if (SerialComm.isOpen() === false) {
          next();
        } else {
          next('/main');
        }
      }
    },
    {
      path: '/main',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      beforeEnter: (to, from, next) => {
        if (SerialComm.isOpen() === true) {
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
