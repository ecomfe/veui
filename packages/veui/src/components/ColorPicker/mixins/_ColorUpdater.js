import {getTypedAncestorTracker} from '../../../utils/helper'

export default {
  mixins: [
    getTypedAncestorTracker('color-homer')
  ],
  methods: {
    updateColor ({h, s, v, l, a, r, g, b}) {
      switch (true) {
        case v !== undefined:
          this.colorHomer.updateHsvValue({h, s, v, a})
          break

        case r !== undefined:
        case g !== undefined:
        case b !== undefined:
          this.colorHomer.updateRgbValue({r, g, b, a})
          break

        default:
          this.colorHomer.updateHslValue({h, s, l, a})
          break
      }
    }
  }
}
