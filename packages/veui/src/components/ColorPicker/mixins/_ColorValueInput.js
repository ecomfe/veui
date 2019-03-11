import ColorUpdater from './_ColorUpdater'
import ColorValueInput from '../_ColorValueInput'
import {clamp} from 'lodash'

export default {
  components: {
    'veui-color-value-input': ColorValueInput
  },
  mixins: [ColorUpdater],
  props: {
    hsl: Object,
    rgb: Object,
    readonly: Boolean
  },
  methods: {
    parseHexValue (val) {
      if (!/^#[0-9A-F]{6}$/i.test(val)) {
        throw new Error('Illegal hex color value')
      }
      return val
    },

    formatHue (val) {
      return Math.round(val)
    },
    parseHue (val) {
      let realValue = parseFloat(val)
      if (isNaN(realValue)) {
        throw new Error('Illegal hue value')
      }
      return realValue % 360
    },

    formatPercentage (val) {
      return Math.round(val * 100) + '%'
    },
    parsePercentage (val) {
      if (!/^\d+(\.\d+)?%$/.test(val)) {
        throw new Error('Illegal percentage value')
      }
      return clamp(parseFloat(val) / 100, 0, 1)
    },

    parseFFValue (val) {
      let realValue = parseInt(val, 10)
      if (isNaN(realValue) || realValue < 0 || realValue > 255) {
        throw new Error('Illegal value')
      }
      return realValue
    }
  }
}
