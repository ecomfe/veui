import Vue from 'vue'
import prompt from '../managers/prompt'

export default {
  install () {
    Vue.prototype.$prompt = {
      popup (...args) {
        return prompt.popup(...args)
      }
    }
  }
}
