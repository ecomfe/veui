import Vue from 'vue'

export default function warn (message, vm) {
  if (process.env.NODE_ENV !== 'production') {
    Vue.util.warn(message, vm)
  }
}
