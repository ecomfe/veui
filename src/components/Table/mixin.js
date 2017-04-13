import { includes } from 'lodash'

export default {
  computed: {
    table () {
      let current = this.$parent
      while (current) {
        let { uiTypes } = current.$options
        if (uiTypes && includes(uiTypes, 'table')) {
          return current
        }
        current = current.$parent
      }
      return null
    }
  }
}
