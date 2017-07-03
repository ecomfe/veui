import Vue from 'vue'
import App from './App'
import router from './router'
import Icon from '@/components/Icon'

Vue.component('icon', Icon)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  name: 'app',
  el: '#app',
  router,
  render: h => h(App)
})
