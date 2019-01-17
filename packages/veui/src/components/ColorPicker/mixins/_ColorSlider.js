import ColorUpdater from './_ColorUpdater'
import Slider from '../../Slider'

export default {
  components: {
    'veui-slider': Slider
  },
  mixins: [
    ColorUpdater
  ],
  props: {
    value: Number
  }
}
