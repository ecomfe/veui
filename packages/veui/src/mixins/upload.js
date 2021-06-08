import { pick, isNumber, uniqueId } from 'lodash'
import drag from '../directives/drag'
import moveEnd from '../directives/move-end'

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
  directives: {
    drag,
    moveEnd
  },
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
        callback: this.handleDragSort
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

    handleDragSort (toIndex, fromIndex) {
      if (toIndex === fromIndex) {
        return
      }
      let promise = new Promise(resolve => {
        this.$refs.transitionGroup.$once('move-end', resolve)
      })
      this.$emit('move', fromIndex, toIndex)
      // 动画完了再回调成功
      return promise
    }
  }
}
