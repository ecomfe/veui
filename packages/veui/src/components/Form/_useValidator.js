import { isFunction, uniq, uniqueId, includes, fill } from 'lodash'
import { normalizeValiditiesOfFields } from './_useValidity'
import { createMixinFacade } from './_facade'

export default createMixinFacade({
  // deps: { getValidators, getValidatorName, getFieldValue }
  exports: [
    'isInteractiveValidating',
    'getInteractiveEvents',
    'isAnyValidating',
    'validate',
    'validateForEvent'
  ],
  data () {
    return {
      interactiveValidatingRecord: {} // 能够构造出提交校验时出交互事件，避免交互校验和提交校验相互影响，所以分开标记
    }
  },
  computed: {
    interactiveValidating () {
      return !!Object.keys(this.interactiveValidatingRecord).length
    },
    realValidators () {
      return (this.deps.getValidators(this.consumer) || [])
        .filter(
          ({ validate, handler, fields }) =>
            fields && isFunction(validate || handler)
        )
        .map(({ validate, handler, fields, triggers }) => {
          fields = Array.isArray(fields) ? fields : [fields]
          return {
            validate: validate || handler,
            fields, // Array<string>
            triggers: normalizeTriggers(triggers, fields.length) // Array<string[] | null | undefined>
          }
        })
    },
    /**
     * 得到可以直接给 field 绑定的事件，即都去掉了 null 和 submit
     * @return Record<fieldName, string[]>
     */
    interactiveEvents () {
      return this.realValidators.reduce((acc, { fields, triggers }) => {
        fields.forEach((field, index) => {
          acc[field] = acc[field] || []
          if (triggers[index]) {
            acc[field] = uniq(
              acc[field].concat(
                triggers[index].filter((item) => item !== 'submit')
              )
            )
          }
        })
        return acc
      }, {})
    }
  },
  methods: {
    isInteractiveValidating () {
      return this.interactiveValidating
    },
    getInteractiveEvents () {
      return this.interactiveEvents
    },
    isAnyValidating (fieldNames) {
      if (fieldNames.length) {
        return Object.keys(this.interactiveValidatingRecord).some((key) =>
          includes(fieldNames, this.interactiveValidatingRecord[key][0])
        )
      }
      return false
    },
    validateForEvent (eventName, fieldName) {
      const validators = this.realValidators.filter((validator) => {
        const { fields, triggers } = validator
        const fIndex = fields.indexOf(fieldName)
        return fIndex >= 0 && includes(triggers[fIndex], eventName)
      })
      return this.doValidate(validators, fieldName)
    },
    validate (fieldNames) {
      let validators = this.realValidators
      if (fieldNames) {
        fieldNames = [].concat(fieldNames)
        validators = validators.filter(({ fields }) =>
          fields.some((fieldName) => includes(fieldNames, fieldName))
        )
      }
      return this.doValidate(validators)
    },
    doValidate (validators, triggerField) {
      let isAsync = false
      const result = validators.map((validator) => {
        const validities = this.execValidator(validator, triggerField)
        const PromiseLike = isFunction(validities.then)
        if (PromiseLike && !isAsync) {
          isAsync = true
        }
        return PromiseLike
          ? validities.then((validities) => ({ validator, validities }))
          : { validator, validities }
      })
      return isAsync ? Promise.all(result) : result
    },
    execValidator (validator, triggerField) {
      const { validate, fields } = validator
      const validities = validate.apply(
        this,
        fields.map((fieldName) =>
          this.deps.getFieldValue(this.consumer, fieldName)
        )
      )

      // 本来可以统一成 Promise 的，但是为了同步校验时不要闪 Loading，需要尽量保证同步校验
      if (validities && isFunction(validities.then)) {
        const endValidator =
          triggerField &&
          this.startValidator(
            this.deps.getValidatorName(this.consumer, validator),
            triggerField
          )
        return validities
          .then((validities) => normalizeValiditiesOfFields(validities))
          .finally(() => endValidator && endValidator())
      }
      return normalizeValiditiesOfFields(validities)
    },
    // triggerField 需要用来记录到底是哪个字段要 loading
    startValidator (validatorName, triggerField) {
      const unique = uniqueId()
      this.$set(
        this.interactiveValidatingRecord,
        validatorName,
        Object.freeze([triggerField, unique])
      )
      return () => {
        const valueInRecord = this.interactiveValidatingRecord[validatorName]
        if (valueInRecord && valueInRecord[1] === unique) {
          this.$delete(this.interactiveValidatingRecord, validatorName)
        }
      }
    },
    clearState () {
      this.interactiveValidatingRecord = {}
    }
  }
})

// 保证 triggers 是 Array<string[] | null | undefined>
function normalizeTriggers (triggers, length) {
  if (triggers == null || typeof triggers === 'string') {
    triggers = fill(Array(length), triggers)
  } else if (!Array.isArray(triggers)) {
    throw new Error(
      '[veui-form] The triggers of validators must be an array or a string.'
    )
  }
  return triggers.map((item) => {
    return typeof item === 'string' ? item.split(/\s*,\s*/) : item
  })
}
