import { setBaseZIndex, addOverlay } from './managers/overlay'
import drag from './directives/drag'
import outside from './directives/outside'

export default {
  install (Vue, { baseZIndex = 100 } = {}) {
    setBaseZIndex(baseZIndex)
    Vue.prototype.$veui = {
      addOverlay
    }

    Vue.directive('drag', drag)
    Vue.directive('outside', outside)
  }
}
