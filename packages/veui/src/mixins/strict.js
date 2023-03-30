export function useStrict (features) {
  return {
    props: {
      strict: {
        type: [Boolean, Object],
        validator (val) {
          if (typeof val === 'boolean') {
            return true
          }

          const keys = Object.keys(val)
          return (
            keys.length === 0 ||
            keys.every((key) => features.indexOf(key) !== -1)
          )
        }
      }
    },
    computed: {
      realStrict () {
        if (typeof this.strict === 'boolean') {
          return features.reduce((result, key) => {
            result[key] = this.strict
            return result
          }, {})
        }

        return this.strict
      }
    }
  }
}
