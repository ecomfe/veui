import { setBaseZIndex, addOverlay } from './helper/overlayManager'
import drag from './directives/drag'

export default {
  install (Vue, { baseZIndex = 100 } = {}) {
    setBaseZIndex(baseZIndex)
    Vue.prototype.$veui = {
      addOverlay
    }

    Vue.directive('drag', drag)
  }
}
