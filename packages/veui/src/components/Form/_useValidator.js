import { isFunction, uniqueId, includes, fill } from 'lodash'
import { normalizeValiditiesOfFields } from './_useValidity'
import { bindVm } from '../../utils/context'
import Vue from 'vue'

function createValidatorMixinImpl ({
  getValidators,
  getFieldValue,
  getValidatorName
}) {
  return new Vue({
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
        return (getValidators() || [])
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
              triggers[index].forEach((trigger) => {
                if (trigger.indexOf(':') >= 0) {
                  const [triggerField, realTrigger] = trigger.split(':')
                  acc[triggerField] = acc[triggerField] || []
                  addTrigger(acc[triggerField], realTrigger)
                  trigger = realTrigger
                }
                addTrigger(acc[field], trigger)
              })
            }
          })
          return acc
        }, {})
      }
    },
    methods: {
      isAnyValidating (fieldNames) {
        if (fieldNames.length) {
          return Object.keys(this.interactiveValidatingRecord).some((key) =>
            includes(fieldNames, this.interactiveValidatingRecord[key][0])
          )
        }
        return false
      },
      validateForEvent (triggerEvent, triggerField, ruleResult) {
        const validators = this.realValidators.filter((validator) => {
          const { fields, triggers } = validator
          const fIndex = fields.indexOf(triggerField)
          return (
            (fIndex >= 0 && includes(triggers[fIndex], triggerEvent)) ||
            triggers.some((trigger) =>
              includes(trigger, `${triggerField}:${triggerEvent}`)
            )
          )
        })
        return this.doValidate(validators, ruleResult, triggerField)
      },
      validate (fieldNames, ruleResult) {
        let validators = this.realValidators
        if (fieldNames) {
          fieldNames = [].concat(fieldNames)
          validators = validators.filter(({ fields }) =>
            fields.some((fieldName) => includes(fieldNames, fieldName))
          )
        }
        return this.doValidate(validators, ruleResult)
      },
      doValidate (validators, ruleResult, triggerField) {
        let isAsync = false
        const result = validators.map((validator) => {
          const validities = this.execValidator(
            validator,
            ruleResult,
            triggerField
          )
          const PromiseLike = isFunction(validities.then)
          isAsync = isAsync || PromiseLike
          return PromiseLike
            ? validities.then((validities) => ({ validator, validities }))
            : { validator, validities }
        })
        return isAsync ? Promise.all(result) : result
      },
      execValidator (validator, ruleResult, triggerField) {
        const { validate, fields } = validator
        const validities = validate.apply(
          this,
          fields
            .map((fieldName) => getFieldValue(fieldName))
            .concat({ ruleResult })
        )

        // 本来可以统一成 Promise 的，但是为了同步校验时不要闪 Loading，需要尽量保证同步校验
        if (validities && isFunction(validities.then)) {
          const endValidator =
            triggerField &&
            this.startValidator(getValidatorName(validator), triggerField)
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
      }
    }
  })
}

export default function useValidator (namespace, deps) {
  return {
    computed: {
      [namespace] () {
        const impl = createValidatorMixinImpl(bindVm(deps, this))
        return {
          isInteractiveValidating: () => impl.interactiveValidating,
          getInteractiveEvents: () => impl.interactiveEvents,
          isAnyValidating: impl.isAnyValidating,
          validate: impl.validate,
          validateForEvent: impl.validateForEvent
        }
      }
    }
  }
}

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

function addTrigger (triggers, trigger) {
  if (trigger !== 'submit' && triggers.indexOf(trigger) === -1) {
    triggers.push(trigger)
  }
}
