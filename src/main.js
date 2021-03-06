import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'

Vue.config.productionTip = false

new Vue({
  el: '#network-pro',
  router,
  store,
  render: (h) => h(App),
})
