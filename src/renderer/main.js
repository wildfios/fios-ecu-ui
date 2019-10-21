import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import SerialComm from './services/SerialComm'

import { sync } from 'vuex-router-sync';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(Buefy)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

sync(store, router);

const EventBus = new Vue();
export default EventBus;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
