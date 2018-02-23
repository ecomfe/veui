import { findIndex } from 'lodash'
import { getFocusable } from '../utils/dom'

export default {
  methods: {
    navigate (forward = true) {
      let focusable = getFocusable(this.$refs.box)
      let length = focusable.length
      if (!length) {
        return
      }

      let index = findIndex(focusable, elem => elem === document.activeElement)
      if (index === -1) {
        focusable[0].focus()
        return
      }

      focusable[(index + length + (forward ? 1 : -1)) % length].focus()
    }
  }
}
