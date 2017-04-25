import { setBaseZIndex, addOverlay } from './managers/overlay'
import drag from './directives/drag'
import clickoutside from './directives/clickoutside'

export default {
  install (Vue, { baseZIndex = 100 } = {}) {
    setBaseZIndex(baseZIndex)
    Vue.prototype.$veui = {
      addOverlay
    }

    Vue.directive('drag', drag)
    Vue.directive('clickoutside', clickoutside)
  }
}
