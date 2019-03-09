import { includes } from 'lodash'
import { getTypedAncestorTracker, isTopMostOfType } from '../utils/helper'
import '../common/uiTypes'
import focusable from './focusable'

export default {
  uiTypes: ['input'],
  mixins: [focusable],
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
      return Boolean(
        this.disabled || (this.formField && this.formField.realDisabled)
      )
    },
    realReadonly () {
      return Boolean(
        this.readonly || (this.formField && this.formField.realReadonly)
      )
    },
    realInvalid () {
      return (
        this.formField && !this.formField.validity.valid && this.isTopMostInput
      )
    },
    ...getTypedAncestorTracker('field', 'formField').computed
  },
  created () {
    if (!this.isTopMostInput || !this.formField || !this.formField.realField) {
      return
    }

    this.$emit = this.realEmit.bind(this, this.$emit)
  },
  methods: {
    realEmit (originalEmit, eventName, ...args) {
      originalEmit.apply(this, [eventName, ...args])
      // 过滤掉 vue 内部 hook 和 .sync 的 update 事件，不需要往上处理
      let [prefix, name] = eventName.split(':')
      if (!name || !includes(['hook', 'update'], prefix)) {
        this.formField.$emit('interact', eventName)
      }
    }
  }
}
