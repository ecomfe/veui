import Vue from 'vue'

export default function warn (message, vm) {
  Vue.util.warn(message, vm)
}
