import {formatColor} from '../../../utils/color'

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
  methods: {
    updateColor (color) {
      this.previousHsva = color
      this.$emit('update:color', formatColor(color, {
        format: this.format
      }))
    },
    updateHsvaValue (hsva) {
      this.updateColor({...this.hsva, ...hsva})
    }
  }
}
