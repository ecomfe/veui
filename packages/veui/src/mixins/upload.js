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

    // the provide and inject bindings are NOT reactive
    options: Object
  },
  computed
}
