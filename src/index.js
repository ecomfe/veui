import { setBaseZIndex, addOverlay } from './managers/overlay'

export default {
  install (Vue, { baseZIndex = 100 } = {}) {
    setBaseZIndex(baseZIndex)
    Vue.prototype.$veui = {
      addOverlay
    }
  }
}
