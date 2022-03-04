<template>
<form
  :ui="realUi"
  :class="$c('form')"
  @submit.prevent="handleSubmit"
  @reset.prevent="reset(null)"
>
  <slot v-bind="{ submit, validating: isValidating, validities }"/>
  <div
    v-if="hasActions()"
    :class="$c('form-actions')"
  >
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
  pull,
  omit,
  mergeWith
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/global'
import useValidity, {
  isAllValid,
  normalizeValiditiesOfFields
} from './_useValidity'
import useValidator from './_useValidator'
import { useCoupled, cacheFacade } from './_facade'

const { asParent: asFormParent, asChild: asFormChild } = useCoupled('form')

export { asFormChild }

const createFacade = cacheFacade((vm) => ({
  // 全写成函数目的：惰性响应式
  isDisabled: () => vm.disabled,
  isReadonly: () => vm.readonly,
  getFormData: () => vm.data,
  getValidityDisplay: () => vm.validityDisplay,
  isValidating: (...args) => vm.validator.isAnyValidating(...args),
  addField (field) {
    vm.fields.push(field)
    return () => {
      pull(vm.fields, field)
    }
  },
  getValiditiesOfFields: vm.validityManager.getValiditiesOfFields,
  updateRuleValidities: vm.validityManager.updateRuleValidities,
  clearValiditiesOfField: vm.validityManager.clearValiditiesOfField,
  updateIntrinsicValidities: vm.validityManager.updateIntrinsicValidities,
  validateForEvent: vm.validateForEvent,
  getInteractiveEvents: vm.validator.getInteractiveEvents
}))

export default {
  name: 'veui-form',
  uiTypes: ['form-container'],
  mixins: [
    prefix,
    ui,
    asFormParent(createFacade),
    useValidity('validityManager'),
    useValidator('validator', {
      getValidators: (vm) => vm.validators,
      getValidatorName: (vm, validator) => vm.getValidatorName(validator),
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
    validityDisplay: {
      type: String,
      default: 'default',
      validator (val) {
        return ['default', 'icon'].indexOf(val) >= 0
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
    getValidatorName ({ fields }) {
      return `validator:${fields.join(',')}`
    },
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

      let invalid = false
      const markAndCheckValid = (result) => (invalid = !isAllValid(result))
      this.validationPromise = new Promise((resolve) =>
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(undefined, data))
          : resolve()
      )
        .then((result) => {
          result = normalizeValiditiesOfFields(result)
          return markAndCheckValid(result) ? this.validate() : result
        })
        .then((result) => {
          if (invalid) {
            return result
          }

          result = normalizeValiditiesOfFields(result)
          if (markAndCheckValid(result)) {
            return isFunction(this.afterValidate)
              ? this.afterValidate.call(undefined, data)
              : result
          }
        })
        .then((result) => {
          this.submissionValidating = false
          if (!invalid) {
            result = normalizeValiditiesOfFields(result)
            if (isAllValid(result)) {
              this.$emit('submit', data, e)
              return
            }
          }
          this.$emit('invalid', result)
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
    validatorValidate (fieldNames) {
      return Promise.resolve(this.validator.validate(fieldNames)).then(
        this.updateValidatorValidities
      )
    },
    validateForEvent (eventName, fieldName) {
      return Promise.resolve(
        this.validator.validateForEvent(eventName, fieldName)
      ).then(this.updateValidatorValidities)
    },
    updateValidatorValidities (validityResult) {
      return validityResult.map(({ validator, validities }) => {
        const validatorName = this.getValidatorName(validator)
        this.validityManager.updateValidatorValidities(
          validatorName,
          validities
        )
        return validities
      })
    },
    validate (fieldNames) {
      return Promise.all([
        this.ruleValidate(fieldNames),
        this.validatorValidate(fieldNames)
      ]).then(([ruleResult, valiResult]) => {
        return mergeWith({}, ruleResult, ...valiResult, mergeValidities)
      })
    },
    // @deprecrated
    reset (names) {
      let fields = this.fields
      if (names) {
        fields = fields.filter((field) => includes(names, field.getName()))
      }
      fields.forEach((target) => {
        target.resetValue()
      })
    }
  }
}

function mergeValidities (dest, src) {
  return [].concat(dest || []).concat(src || [])
}
</script>
