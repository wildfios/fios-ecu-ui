import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/a',
      name: 'port-selector',
      component: require('@/components/PortSelector').default
    },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default      
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
