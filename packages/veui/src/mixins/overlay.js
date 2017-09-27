import { normalizeClass, getClassPropDef, resolveOverlayPosition } from '../utils/helper'
import { omit } from 'lodash'

export default {
  props: {
    overlayClass: getClassPropDef(),
    overlayOptions: {
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
      let options = { ...this.localOverlayOptions, ...this.overlayOptions }
      let { position } = options
      return omit({
        ...options,
        ...resolveOverlayPosition(position)
      }, 'position')
    }
  },
  methods: {
    mergeOverlayClass (klass) {
      return { ...normalizeClass(this.overlayClass), ...normalizeClass(klass) }
    }
  }
}
