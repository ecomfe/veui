import ValueHsl from '../ColorValueHsl'
import ValueRgb from '../ColorValueRgb'
import ValueHex from '../ColorValueHex'
import ValueAlpha from '../ColorValueAlpha'

export default {
  components: {
    'veui-color-value-hsl': ValueHsl,
    'veui-color-value-rgb': ValueRgb,
    'veui-color-value-hex': ValueHex,
    'veui-color-value-alpha': ValueAlpha
  },
  props: {
    hue: Number,
    saturation: Number,
    brightness: Number,
    alpha: Number,
    readonly: {
      type: Boolean,
      default: false
    }
  }
}
