import Vue from 'vue'
import App from './App'
import router from './router'
import 'classlist-polyfill'
import 'focus-visible'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  name: 'app',
  el: '#app',
  router,
  render: h => h(App)
})
