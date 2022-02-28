import { isFunction, uniq, uniqueId, includes, fill } from 'lodash'
import { ValidityType, isValid } from './_ValidityManager'

export default function useValidator (
  namespace,
  { getValidators, getValidatorName, getFieldValue }
) {
  return {
    data () {
      return {
        interactiveValidatingRecord: {} // 能够构造出提交校验时出交互事件，避免交互校验和提交校验相互影响，所以分开标记
      }
    },
    computed: {
      [namespace] () {
        const {
          _isInteractiveValidating,
          _validateForEvent,
          _interactiveEvents,
          _isAnyValidating,
          _validate
        } = this
        return {
          isInteractiveValidating: _isInteractiveValidating,
          validateForEvent: _validateForEvent,
          getInteractiveEvents: () => _interactiveEvents,
          isAnyValidating: _isAnyValidating,
          validate: _validate
        }
      },
      _interactiveValidating () {
        return !!Object.keys(this.interactiveValidatingRecord).length
      },
      _realValidators () {
        return (getValidators(this) || [])
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
      _interactiveEvents () {
        return this._realValidators.reduce((acc, { fields, triggers }) => {
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
      _isInteractiveValidating () {
        return this._interactiveValidating
      },
      _isAnyValidating (fieldNames) {
        if (fieldNames.length) {
          return Object.keys(this.interactiveValidatingRecord).some((key) =>
            includes(fieldNames, this.interactiveValidatingRecord[key][0])
          )
        }
        return false
      },
      _validateForEvent (eventName, fieldName) {
        const validators = this._realValidators.filter((validator) => {
          const { fields, triggers } = validator
          const fIndex = fields.indexOf(fieldName)
          return fIndex >= 0 && includes(triggers[fIndex], eventName)
        })
        return this._doValidate(validators, fieldName)
      },
      _validate (fieldNames) {
        let validators = this._realValidators
        if (fieldNames) {
          fieldNames = [].concat(fieldNames)
          validators = validators.filter(({ fields }) =>
            fields.some((fieldName) => includes(fieldNames, fieldName))
          )
        }
        return this._doValidate(validators)
      },
      _doValidate (validators, triggerField) {
        let isAsync = false
        const result = validators.map((validator) => {
          const validities = this._execValidator(validator, triggerField)
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
      _execValidator (validator, triggerField) {
        const { validate, fields } = validator
        const validities = validate.apply(
          this,
          fields.map((fieldName) => getFieldValue(this, fieldName))
        )

        // 本来可以统一成 Promise 的，但是为了同步校验时不要闪 Loading，需要尽量保证同步校验
        if (validities && isFunction(validities.then)) {
          const endValidator =
            triggerField &&
            this._startValidator(
              getValidatorName(this, validator),
              triggerField
            )
          return validities.then((validities) => {
            endValidator && endValidator()
            return normalizeValidatorResult(validities)
          })
        }
        return normalizeValidatorResult(validities)
      },
      _startValidator (validatorName, triggerField) {
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

/**
 *
 * @param {true | undefined | { field1: false | string | {type?, message?}, ... }} result 一个 validator 校验结果
 *   true | undefined 表示该 validator 校验成功
 * @return {true | { field1: {type, message? }}}
 */
function normalizeValidatorResult (result) {
  if (isValid(result)) {
    return true
  }
  if (typeof result !== 'object') {
    throw new Error('the validation result is required.')
  }

  return Object.keys(result).reduce((acc, fieldName) => {
    const validities = result[fieldName]
    // foo: true/null 直接忽略掉
    if (!isValid(validities)) {
      acc[fieldName] = Array.isArray(validities)
        ? validities.filter((val) => !isValid(val)).map(toValidity)
        : [toValidity(validities)]
    }
    return acc
  }, {})
}

function toValidity (val) {
  if (typeof val !== 'object') {
    return {
      type: ValidityType.ERROR,
      message: val || ''
    }
  }
  return val
}
