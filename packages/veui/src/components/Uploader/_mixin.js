import { pick, isNumber, uniqueId } from 'lodash'
import drag from '../../directives/drag'

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

const computed = sharedProps.reduce((ret, key) => {
  ret[key] = function () {
    return this.options[key]
  }
  return ret
}, {})

export default {
  directives: { drag },
  props: {
    files: Array,
    addable: Boolean,
    disabled: Boolean,
    sortable: Boolean,

    // the provide and inject bindings are NOT reactive, use object to work around
    options: Object
  },
  computed: {
    ...computed,

    dragSortOptions () {
      return {
        disabled: !this.sortable,
        name: uniqueId('veui-uploader-drag-sort-'),
        sort: this.handleDragSort
      }
    }
  },
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
    },

    handleDragSort (fromIndex, toIndex) {
      if (toIndex === fromIndex) {
        return
      }
      this.$emit('move', fromIndex, toIndex)
    }
  }
}
