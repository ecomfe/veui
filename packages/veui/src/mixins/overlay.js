import { isObject, isString } from 'lodash'
import { normalizeClass } from '../utils/helper'

export default {
  props: {
    overlayClass: {
      validator (value) {
        return isObject(value) || isString(value)
      },
      default: null
    }
  },
  methods: {
    mergeOverlayClass (clazz) {
      return { ...normalizeClass(this.overlayClass), ...normalizeClass(clazz) }
    }
  }
}
