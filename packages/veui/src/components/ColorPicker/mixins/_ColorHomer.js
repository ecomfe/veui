import {formatColor} from '../../../utils/color'
import tinycolor from 'tinycolor2'
import {merge} from 'lodash'

export default {
  uiTypes: ['color-homer'],
  props: {
    color: String,
    ui: String,
    variant: String,
    alpha: Boolean,
    switchable: Boolean
  },
  model: {
    prop: 'color',
    event: 'update:color'
  },
  data () {
    return {
      lockedHue: null
    }
  },
  computed: {
    hsl () {
      let hsl = tinycolor(this.color).toHsl()
      return this.lockedHue ? {...hsl, h: this.lockedHue} : hsl
    },
    hsv () {
      let hsv = tinycolor(this.color).toHsv()
      return this.lockedHue ? {...hsv, h: this.lockedHue} : hsv
    },
    rgb () {
      return tinycolor(this.color).toRgb()
    }
  },
  methods: {
    updateColor (color) {
      this.$emit('update:color', formatColor(color, {
        format: this.variant
      }))
    },
    updateHsvValue (hsv) {
      this.updateColor(merge(this.hsv, hsv))
    },
    updateHslValue (hsl) {
      this.updateColor(merge(this.hsl, hsl))
    },
    updateRgbValue (rgb) {
      this.updateColor(merge(this.rgb, rgb))
    },
    lockHue (hue) {
      this.lockedHue = hue
    }
  }
}
