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
  assign,
  zipObject,
  map,
  pull,
  omit
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import '../../common/global'
import { getValidityManager, isValid } from './_ValidityManager'
import useValidator from './_useValidator'
import { useCoupled, cacheShape } from './_shaped'

const { asParent: asFormParent, asChild: asFormChild } = useCoupled('form')

export { asFormChild }

const makeShape = cacheShape((vm) => ({
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
    asFormParent(makeShape),
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
    validityManager () {
      return getValidityManager()
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
      this.validationPromise = new Promise((resolve) =>
        isFunction(this.beforeValidate)
          ? resolve(this.beforeValidate.call(undefined, data))
          : resolve()
      )
        .then((res) => (isValid(res) ? this.validate() : res))
        .then((res) => {
          if (isValid(res)) {
            return isFunction(this.afterValidate)
              ? this.afterValidate.call(undefined, data)
              : undefined
          }
          return res
        })
        .then((res) => {
          this.submissionValidating = false
          if (isValid(res)) {
            this.$emit('submit', data, e)
          } else {
            this.$emit('invalid', res)
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
      return fields.map((field) => field.validate())
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
        let result = [...ruleResult, ...valiResult]
        result = result.filter((mixed) => !isValid(mixed))
        return result.length ? assign({}, ...result) : true
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
</script>
