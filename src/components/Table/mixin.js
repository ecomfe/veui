export default {
  computed: {
    table () {
      let current = this.$parent
      while (current) {
        let { uiTypes } = current.$options
        if (uiTypes && uiTypes.indexOf('table') !== -1) {
          return current
        }
        current = current.$parent
      }
      return null
    }
  }
}
