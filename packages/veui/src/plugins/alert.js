import Vue from 'vue'
import alert from '../managers/alert'

function getMethod (name) {
  return alert[name].bind(alert)
}

let methods = ['success', 'info', 'error'].map(name => getMethod)

export default {
  install () {
    Vue.prototype.$alert = methods
  }
}
