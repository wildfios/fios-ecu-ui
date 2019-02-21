import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'port-selector',
      component: require('@/components/PortSelector').default
    },
    {
      path: '/main',
      name: 'landing-page',
      component: require('@/components/LandingPage').default      
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
