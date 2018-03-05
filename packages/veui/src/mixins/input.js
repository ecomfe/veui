import { getTypedAncestorTracker, isTopMostOfType } from '../utils/helper'

export default {
  uiTypes: ['input'],
  props: {
    name: String,
    readonly: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      initialData: undefined,
      isTopMostInput: isTopMostOfType(this, 'input', 'field')
    }
  },
  computed: {
    realName () {
      return (this.formField && this.formField.name) || this.name
    },
    realDisabled () {
      return Boolean(this.disabled || (this.formField && this.formField.realDisabled))
    },
    realReadonly () {
      return Boolean(this.readonly || (this.formField && this.formField.realReadonly))
    },
    ...getTypedAncestorTracker('field', 'formField').computed
  },
  created () {
    if (!this.isTopMostInput || !this.formField || !this.formField.field) {
      return
    }

    this.$emit = this.realEmit.bind(this, this.$emit)
  },
  methods: {
    realEmit (originalEmit, eventName, data, event) {
      originalEmit.apply(this, Array.prototype.slice.call(arguments, 1))
      // 过滤掉 vue 内部 hook 的事件，不需要往上处理
      if (eventName.indexOf('hook:') !== 0) {
        this.formField.$emit('interact', eventName)
      }
    }
  }
}
