import {
  mergeClasses,
  mergeStyles,
  getClassPropDef,
  getStylePropDef
} from '../utils/helper'

export default {
  props: {
    overlayClass: getClassPropDef(),
    overlayStyle: getStylePropDef(),
    overlayOptions: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      localOverlayOptions: {}
    }
  },
  computed: {
    realOverlayOptions () {
      return { ...this.localOverlayOptions, ...this.overlayOptions }
    }
  },
  methods: {
    mergeOverlayClass (klass) {
      return mergeClasses(this.overlayClass, klass)
    },
    mergeOverlayStyle (style, override) {
      return override
        ? mergeStyles(this.overlayStyle, style)
        : mergeStyles(style, this.overlayStyle)
    },
    relocate () {
      if (!this.$refs.overlay) {
        throw new Error('Can not find [this.$refs.overlay] to relocate')
      }
      this.$refs.overlay.relocate()
    }
  }
}
