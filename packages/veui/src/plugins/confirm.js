import Vue from 'vue'
import confirm from '../managers/confirm'

function getMethod (name) {
  return alert[name].bind(confirm)
}

let methods = ['success', 'info', 'error', 'warn'].map(name => getMethod)

export default {
  install () {
    Vue.prototype.$confirm = methods
  }
}
