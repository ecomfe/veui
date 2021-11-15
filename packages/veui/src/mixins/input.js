import { mergeWith, reduce, forEach } from 'lodash'
import { getTypedAncestorTracker, isTopMostOfType } from '../utils/helper'
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
      return Boolean(
        this.invalid ||
          (this.formField &&
            !this.formField.validity.valid &&
            this.isTopMostInput)
      )
    },
    isUnderField () {
      return this.formField && this.formField.realField && this.isTopMostInput
    },
    listenersWithValidations () {
      // 为啥要 wrap listeners: 避免 $listener 和 field/form 上交互事件合并时导致无限递归
      let listeners = reduce(
        this.$listeners,
        (acc, listener, key) => {
          acc[key] = (...args) => listener.call(this, ...args)
          return acc
        },
        {}
      )
      if (
        this.isUnderField &&
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
    if (!this.isUnderField) {
      return
    }

    this.$watch(
      () => this.formField.interactiveListeners,
      this.applyValidationListeners,
      { immediate: true }
    )
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
