import { pick, isNumber } from 'lodash'

export const sharedProps = [
  'type',
  'controls',
  'icons',
  'realUi',
  'uiProps',
  'uiParts',
  'entries',
  'pickerPosition',
  'requestMode'
]

const computed = sharedProps.reduce(function (ret, key) {
  ret[key] = function () {
    return this.options[key]
  }
  return ret
}, {})

export default {
  props: {
    files: Array,
    addable: Boolean,
    disabled: Boolean,

    // the provide and inject bindings are NOT reactive, use object to work around
    options: Object
  },
  computed,
  methods: {
    getScopeValue (index) {
      let file = this.files[index]
      return {
        ...file.value,
        ...pick(file, ['status', 'loaded', 'total']),
        index
      }
    },
    isIndeterminate ({ loaded, total }) {
      return !isNumber(loaded) || !isNumber(total) || loaded < 0 || total <= 0
    }
  }
}
