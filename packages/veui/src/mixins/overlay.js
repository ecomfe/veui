import { mergeClasses, mergeStyles, LOOSE_PROP_DEF } from '../utils/helper'

export default {
  props: {
    overlayClass: LOOSE_PROP_DEF,
    overlayStyle: LOOSE_PROP_DEF,
    overlayOptions: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    realOverlayOptions () {
      return { ...this.defaultOverlayOptions, ...this.overlayOptions }
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
