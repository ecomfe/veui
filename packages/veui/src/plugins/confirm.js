import Vue from 'vue'
import confirm from '../managers/confirm'

export default {
  install () {
    Vue.prototype.$confirm = {
      popup (...args) {
        return confirm.popup(...args)
      }
    }
  }
}
