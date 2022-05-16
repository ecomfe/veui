import { mergeWith, forEach } from 'lodash'
import { isTopMostOfType, wrapListeners, getModelEvent } from '../utils/helper'
import focusable from './focusable'
import { useFormChild } from '../components/Form/Form'
import { useFieldChild } from '../components/Form/Field'
import { useFacade } from '../components/Form/_facade'

export default {
  uiTypes: ['input'],
  mixins: [
    focusable,
    useFacade((vm) => ({
      getDeclaredName: () => vm.name,
      // 内置校验
      validate: () => {
        return typeof vm.validate === 'function' ? vm.validate() : undefined
      }
    })),
    useFormChild('form'),
    useFieldChild('field', (vm) => {
      if (vm.isTopMostInput) {
        return vm.field.addInput(vm.getFacade())
      }
    })
  ],
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
      return (this.field && this.field.getName()) || this.name
    },
    realDisabled () {
      return Boolean(
        this.disabled ||
          (this.field && this.field.isDisabled()) ||
          (this.form && this.form.isDisabled()) // 可能不在 field 中，而直接在 form 中
      )
    },
    realReadonly () {
      return Boolean(
        this.readonly ||
          (this.field && this.field.isReadonly()) ||
          (this.form && this.form.isReadonly()) // 可能不在 field 中，而直接在 form 中
      )
    },
    realInvalid () {
      return Boolean(
        this.invalid ||
          (this.field &&
            this.field.isInvalid(this.getFacade()) &&
            this.isTopMostInput)
      )
    },
    isUnderField () {
      return this.field && this.field.getName() && this.isTopMostInput
    },
    listenersFromField () {
      const valueChangeEvent = getModelEvent(this)
      const listeners = this.field.getInteractiveListeners(this.getFacade())
      return {
        ...listeners,
        [valueChangeEvent]: (...args) => {
          // 先清空再触发交互事件
          this.field.clearValidities()
          if (listeners[valueChangeEvent]) {
            listeners[valueChangeEvent](...args)
          }
        }
      }
    },
    listenersWithValidations () {
      // 为啥要 wrap listeners: 避免 $listener 和 field/form 上交互事件合并时导致无限递归
      let listeners = wrapListeners(this.$listeners)
      if (this.isUnderField && Object.keys(this.listenersFromField).length) {
        return mergeWith(listeners, this.listenersFromField, (a, b) =>
          [].concat(a || [], b || [])
        )
      }
      return listeners
    }
  },
  created () {
    if (!this.isUnderField) {
      return
    }

    this.$watch(() => this.listenersFromField, this.applyValidationListeners, {
      immediate: true
    })
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
