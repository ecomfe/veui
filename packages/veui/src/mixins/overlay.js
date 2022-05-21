import { LOOSE_PROP_DEF, normalizeClass } from '../utils/helper'

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
      return normalizeClass(this.overlayClass, klass)
    },
    relocate () {
      if (!this.$refs.overlay) {
        throw new Error('Can not find [this.$refs.overlay] to relocate')
      }
      this.$refs.overlay.relocate()
    }
  }
}
