import {getTypedAncestorTracker} from '../../../utils/helper'

export default {
  mixins: [
    getTypedAncestorTracker('color-homer')
  ],
  methods: {
    updateHsvValue (hsv) {
      if (hsv.a !== undefined) {
        // 这里只更新 hsv，如果有传 alpha，就干掉
        delete hsv.a
      }
      this.colorHomer.updateHsvaValue(hsv)
    },
    updateAlphaValue (a) {
      this.colorHomer.updateHsvaValue({a})
    }
  }
}
