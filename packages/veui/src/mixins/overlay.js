import { mergeClasses, getClassPropDef } from '../utils/helper'

export default {
  props: {
    overlayClass: getClassPropDef(),
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
    relocate () {
      if (!this.$refs.overlay) {
        throw new Error('Can not find [this.$refs.overlay] to relocate')
      }
      this.$refs.overlay.relocate()
    }
  }
}
