<template>
<form
  :ui="realUi"
  :class="$c('form')"
  @submit.prevent="handleSubmit"
  @reset.prevent="reset(null)"
>
  <slot v-bind="{ submit, validating: isValidating, validities }"/>
  <div v-if="hasActions()" :class="$c('form-actions')">
    <slot
      name="actions"
      v-bind="{ submit, validating: isValidating, validities }"
    />
  </div>
</form>
</template>

<script>
import {
  isFunction,
  includes,
  zipObject,
  map,
  omit,
  mergeWith,
  uniq
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/global'
import { pull } from '../../utils/helper'
import useValidity, {
  isAllValid,
  isSimpleValid,
  normalizeValiditiesOfFields
} from './_useValidity'
import useValidator from './_useValidator'
import { useCoupled, useFacade } from './_facade'

const { useParent: useFormParent, useChild: useFormChild } = useCoupled('form')

export { useFormChild }

export default {
  name: 'veui-form',
  uiTypes: ['form-container'],
  mixins: [
    prefix,
    ui,
    useFacade((vm) => ({
      // 全写成函数目的：惰性响应式
      isDisabled: () => vm.disabled,
      isReadonly: () => vm.readonly,
      getFormData: () => vm.data,
      labelPosition: () => vm.labelPosition,
      isValidating: (...args) => vm.validator.isAnyValidating(...args),
      addField (field) {
        vm.fields.push(field)
        return () => {
          pull(vm.fields, field)
          vm.clearValidities([field.getName()])
        }
      },
      getValiditiesOf: vm.validityManager.getValiditiesOf,
      updateRuleValidities: vm.validityManager.updateRuleValidities,
      updateInputValidities: vm.validityManager.updateInputValidities,
      validateForEvent: vm.validateForEvent,
      clearValidities: vm.clearValidities,
      getInteractiveEvents: vm.getInteractiveEvents
    })),
    useFormParent((vm) => vm.getFacade()),
    useValidity('validityManager'),
    useValidator('validator', {
      getValidators: (vm) => vm.validators,
      getValidatorName: (_, validator) => getValidatorName(validator),
      getFieldValue: (vm, fieldName) => {
        if (vm.fieldsMap[fieldName]) {
          return vm.fieldsMap[fieldName].getFieldValue()
        }
      }
    })
  ],
  props: {
    /**
     * 假设 validator 的 fields 为 ['a','b','c']，triggers 如下，最后生成的结果如下
     * ['change', 'blur,input,xxx', 'submit'] => a(change), b(blur,input,xxx), c(submit)
     * ['blur']                               => a(blur), b(submit), c(submit)
     * 'blur,input'                           => a(blur,input), b(blur,input), c(blur,input)
     * 'blur'                                 => a(blur), b(blur), c(blur)
     *
     * validator的返回值说明：
     * 1. undefined/true 同步校验成功，清空前置同类错误
     * 2. false 同步校验失败，无错误消息
     * 3. Promise resolve(true) 异步校验成功，清空前置同类错误
     * 4. Promise resolve(errObject) 同步校验失败，errOjbect为错误消息
     */
    validators: Array,
    beforeValidate: Function,
    afterValidate: Function,
    disabled: Boolean,
    readonly: Boolean,
    labelPosition: {
      type: String,
      default: 'side',
      validator (value) {
        return ['top', 'side'].indexOf(value) >= 0
      }
    },
    /* eslint-disable vue/require-prop-types */
    data: {}
    /* eslint-enable vue/require-prop-types */
  },
  data () {
    return {
      fields: [],
      submissionValidating: false
    }
  },
  computed: {
    isValidating () {
      return (
        this.submissionValidating || this.validator.isInteractiveValidating()
      )
    },
    validities () {
      return this.validityManager.getValidities()
    },
    fieldsMap () {
      let targets = this.fields.filter((target) => target.getName())
      return zipObject(
        map(targets, (t) => t.getName()),
        targets
      )
    }
  },
  methods: {
    hasActions () {
      return this.$slots.actions || this.$scopedSlots.actions
    },
    submit () {
      this.handleSubmit(null)
    },
    handleSubmit (e) {
      if (this.submissionValidating) {
        return this.validationPromise
      }

      this.submissionValidating = true
      // 把 field 上边 disabled 的项去掉
      let data = omit(
        this.data,
        this.fields
          .filter((field) => field.isDisabled())
          .map((field) => field.getField())
      )

      let valid = true
      const markAndCheckValid = (result, isSimple) =>
        (valid = isSimple ? isSimpleValid(result) : isAllValid(result))
      this.validationPromise = new Promise((resolve) =>
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(undefined, data))
          : resolve()
      )
        .then((result) => {
          return markAndCheckValid(result, true) ? this.validate() : result
        })
        .then((result) => {
          if (
            valid &&
            markAndCheckValid(result, false) &&
            isFunction(this.afterValidate)
          ) {
            return this.afterValidate.call(undefined, data)
          }
          return result
        })
        .then((result) => {
          this.submissionValidating = false
          // before/after 返回一般仅仅支持 boolean?
          if (
            valid &&
            markAndCheckValid(result, isFunction(this.afterValidate))
          ) {
            return this.$emit('submit', data, e)
          }
          this.$emit('invalid', result)
        })
        // 如果在 hooks 中发生错误，最后也保证下重置 submissionValidating
        .finally(() => {
          if (this.submissionValidating) {
            this.submissionValidating = false
          }
        })

      return this.validationPromise
    },
    ruleValidate (fieldNames) {
      const hasNames = Array.isArray(fieldNames) && fieldNames.length
      const fields = this.fields.filter((field) => {
        const name = field.getName()
        const inNames = hasNames ? includes(fieldNames, name) : true
        return name && !field.isDisabled() && !field.isFieldset() && inNames
      })
      return fields.reduce((acc, field) => {
        const result = field.validate()
        if (result !== true) {
          acc[field.getName()] = result
        }
        return acc
      }, {})
    },
    validatorValidate (fieldNames, ruleResult) {
      return Promise.resolve(
        this.validator.validate(fieldNames, ruleResult)
      ).then(this.updateValidatorValidities)
    },
    getInteractiveEvents (fieldName) {
      const events = this.validator.getInteractiveEvents()[fieldName] || []
      this.fields.forEach((field) => {
        events.push.apply(
          events,
          field
            .getSiblingTriggers()
            .filter(({ field }) => fieldName === field)
            .map(({ trigger }) => trigger)
        )
      })
      return uniq(events)
    },
    validateForEvent (eventName, fieldName, ruleResult) {
      this.fields.forEach((field) => {
        const result = field.handleSiblingInteract(fieldName, eventName)
        if (!isSimpleValid(result)) {
          const name = field.getName()
          ruleResult[name] = (ruleResult[name] || []).concat(result)
        }
      })
      return Promise.resolve(
        this.validator.validateForEvent(eventName, fieldName, ruleResult)
      ).then(this.updateValidatorValidities)
    },
    updateValidatorValidities (validityResult) {
      return validityResult.map(({ validator, validities }) => {
        this.validityManager.updateValidatorValidities(
          getValidatorName(validator),
          validities
        )
        return validities
      })
    },
    validate (fieldNames) {
      const ruleResult = this.ruleValidate(fieldNames)
      return this.validatorValidate(fieldNames, ruleResult)
        .then((validatorResult) => {
          return mergeWith({}, ruleResult, ...validatorResult, mergeValidities)
        })
        .then((result) => (isAllValid(result) ? true : result))
    },
    reset (names) {
      let fields = this.fields
      if (names) {
        fields = fields.filter((field) => includes(names, field.getName()))
      }
      fields.forEach((target) => {
        target.resetValue()
      })
    },
    clearValidities (fieldNames) {
      return this.validityManager.clearValidities(fieldNames)
    },
    // 用来 manual 错误
    setValidities (validities) {
      return this.validityManager.updateValidatorValidities(
        'veui:manual',
        normalizeValiditiesOfFields(validities)
      )
    }
  }
}

function mergeValidities (dest, src) {
  return [].concat(dest || []).concat(src || [])
}

function getValidatorName ({ fields }) {
  return `validator:${fields.join(',')}`
}
</script>
