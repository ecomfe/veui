import { setBaseZIndex, addLayer } from './helper/layerManager'
import drag from './directives/drag'

export default {
  install (Vue, { baseZIndex = 100 } = {}) {
    setBaseZIndex(baseZIndex)
    Vue.prototype.$veui = {
      addLayer
    }

    Vue.directive('drag', drag)
  }
}
