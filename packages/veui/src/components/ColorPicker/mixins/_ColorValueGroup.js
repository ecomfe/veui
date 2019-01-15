import ValueHsl from '../_ColorValueHsl'
import ValueRgb from '../_ColorValueRgb'
import ValueHex from '../_ColorValueHex'
import ValueAlpha from '../_ColorValueAlpha'

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
