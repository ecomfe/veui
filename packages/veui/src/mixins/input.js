import { mergeWith, forEach } from 'lodash'
import {
  getTypedAncestorTracker,
  isTopMostOfType,
  wrapListeners
} from '../utils/helper'
import '../common/uiTypes'
import focusable from './focusable'

export default {
  uiTypes: ['input'],
  mixins: [focusable],
  props: {
    name: String,
    readonly: Boolean,
    disabled: Boolean,
    invalid: Boolean
  },
  data () {
    return {
      initialData: undefined,
      isTopMostInput: isTopMostOfType(this, 'input', 'form-field')
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
      // abstract 下的 veui-input 直接从 scoped props 上得到 invalid 传递给 invalid prop
      const field = this.formField
      if (this.invalid || (field && field.withholdValidity)) {
        return this.invalid
      }
      return Boolean(field && !field.validity.valid && this.isTopMostInput)
    },
    isAutoApplyValidation () {
      return (
        this.formField &&
        !this.formField.withholdValidity &&
        this.isTopMostInput
      )
    },
    listenersWithValidations () {
      // 为啥要 wrap listeners: 避免 $listener 和 field/form 上 interactiveListeners 合并后导致无限递归
      let listeners = wrapListeners(this.$listeners)
      if (
        this.isAutoApplyValidation &&
        Object.keys(this.formField.interactiveListeners).length
      ) {
        return mergeWith(
          listeners,
          this.formField.interactiveListeners || {},
          (a, b) => [].concat(a || [], b || [])
        )
      }
      return listeners
    },
    ...getTypedAncestorTracker('form-field').computed
  },
  created () {
    if (this.isAutoApplyValidation) {
      this.$watch(
        () => this.formField.interactiveListeners,
        this.applyValidationListeners,
        { immediate: true }
      )
    }
  },
  methods: {
    applyValidationListeners (val = {}, prev = {}) {
      forEach(prev, (listener, eventName) => {
        if (val[eventName] !== listener) {
          this.$off(eventName, listener)
        }
      })
      forEach(val, (listener, eventName) => {
        if (prev[eventName] !== listener) {
          this.$on(eventName, listener)
        }
      })
    }
  }
}
