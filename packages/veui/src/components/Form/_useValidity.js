import { reduce, forEach, isPlainObject } from 'lodash'
import Vue from 'vue'

export const ValidityStatus = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

const ValidityStatusOrder = {
  [ValidityStatus.SUCCESS]: 3,
  [ValidityStatus.WARNING]: 2,
  [ValidityStatus.ERROR]: 1
}

function createValidityMixinImpl () {
  return new Vue({
    data () {
      return {
        ruleValidities: {}, // Record<fieldName, Array<{status, name: ruleName, message}>>
        validatorValidities: {}, // Record<validatorName, {fieldName1: message, fieldName2: message2}>
        inputValidities: {} // Record<fieldName, Array<{status, message}>>
      }
    },
    computed: {
      validities () {
        // => Record<fieldName, {message}>
        let result = reduce(
          this.validatorValidities,
          (acc, validities) => {
            forEach(validities, (fieldValidities, fieldName) => {
              acc[fieldName] = (acc[fieldName] || []).concat(fieldValidities)
            })
            return acc
          },
          {}
        )

        result = mergeValidities(result, this.ruleValidities)
        return sortValidities(mergeValidities(result, this.inputValidities))
      }
    },
    methods: {
      /**
       * @public
       * 获取指定字段的校验信息
       * @param {Array<string> | string} fields 指定字段
       * @return Array<Validity>
       */
      getValidities (fields) {
        fields = Array.isArray(fields) ? fields : [fields]
        return fields.reduce((acc, name) => {
          const validity = this.validities[name]
          if (validity) {
            return acc.concat(
              validity.map((item) => ({ ...item, fieldName: name }))
            )
          }
          return acc
        }, [])
      },
      getRuleValidities (fieldName) {
        return this.ruleValidities[fieldName]
      },
      /**
       * 更新 rule 校验结果
       * @param {Array<string> | string} fieldName 指定字段
       * @param {undefined | Array<string>} ruleNames undefined 表示要更新该字段的所有 rules
       * @param {true | undefined | Array<Validity>} validities true 和 undefined 表示校验成功
       */
      updateRuleValidities (fieldName, ruleNames, validities) {
        if (ruleNames && ruleNames.length) {
          const prev = (this.ruleValidities[fieldName] || []).filter(
            ({ name }) => ruleNames.indexOf(name) === -1
          )
          // TODO 以前也没有保证顺序
          validities = Array.isArray(validities)
            ? [...validities, ...prev]
            : prev
          if (!validities.length) {
            validities = null
          }
        }
        if (validities && validities.length) {
          this.$set(this.ruleValidities, fieldName, validities)
        } else if (this.ruleValidities[fieldName] != null) {
          this.$delete(this.ruleValidities, fieldName)
        }
      },
      updateValidatorValidities (validatorName, validities) {
        if (validities && Object.keys(validities).length) {
          this.$set(this.validatorValidities, validatorName, validities)
        } else if (this.validatorValidities[validatorName] != null) {
          this.$delete(this.validatorValidities, validatorName)
        }
      },
      updateInputValidities (fieldName, validities) {
        if (isPlainObject(validities)) {
          validities = [validities]
        }
        if (Array.isArray(validities)) {
          this.$set(this.inputValidities, fieldName, validities)
        } else if (this.inputValidities[fieldName] != null) {
          this.$delete(this.inputValidities, fieldName)
        }
      },
      // 删掉指定 field 的指定 validity
      clearValiditiesOfField (fieldName) {
        this.$delete(this.ruleValidities, fieldName)
        this.$delete(this.inputValidities, fieldName)
        Object.keys(this.validatorValidities).forEach((validatorName) => {
          let validity = this.validatorValidities[validatorName]
          if (validity[fieldName]) {
            if (Object.keys(validity).length === 1) {
              this.$delete(this.validatorValidities, validatorName)
            } else {
              this.$delete(validity, fieldName)
            }
          }
        })
      }
    }
  })
}

export default function useValidity (namespace) {
  return {
    computed: {
      [namespace] () {
        const impl = createValidityMixinImpl()
        return {
          getValidities: () => impl.validities,
          getValiditiesOf: impl.getValidities,
          clearValiditiesOfField: impl.clearValiditiesOfField,
          updateRuleValidities: impl.updateRuleValidities,
          updateValidatorValidities: impl.updateValidatorValidities,
          updateInputValidities: impl.updateInputValidities
        }
      }
    }
  }
}

function mergeValidities (dest, validities) {
  return reduce(
    validities,
    (acc, fieldValidities, fieldName) => {
      acc[fieldName] = (acc[fieldName] || []).concat(fieldValidities)
      return acc
    },
    dest
  )
}

function sortValidities (validities) {
  forEach(validities, (fieldValidities) => {
    fieldValidities.sort(
      (a, b) => ValidityStatusOrder[a.status] - ValidityStatusOrder[b.status]
    )
  })
  return validities
}

/*
 * type SimpleSuccess = true | null | undefined
 * type RuleResultSingle = SimpleSuccess | string | {status: ValidityStatus, message?: string}
 * type RuleResult = RuleResultSingle | Array<RuleResultSingle>
 * type ValidatorResult = SimpleSuccess | Record<fieldNameString, RuleResult>
 */

export function isSimpleValid (validity) {
  return validity === true || validity == null
}

function normalize (value) {
  if (isSimpleValid(value)) {
    return true
  }

  let result = value
  if (!isPlainObject(value)) {
    result = { message: value || '' }
  }
  result.status = result.status || ValidityStatus.ERROR
  return result
}

/**
 * normalize 一个 field 的校验结果
 * @param {RuleResult} value 校验结果
 * @return true | Array<{status: ValidityStatus, message?: string}>
 */
export function normalizeValidities (value) {
  if (Array.isArray(value)) {
    return value.reduce((acc, val) => {
      const itemResult = normalize(val)
      if (itemResult !== true) {
        acc.push(itemResult)
      }
      return acc
    }, [])
  }
  value = normalize(value)
  return value === true ? value : [value]
}

export function normalizeValiditiesOfFields (validitiesOfFields) {
  if (isPlainObject(validitiesOfFields)) {
    return Object.keys(validitiesOfFields).reduce((acc, fieldName) => {
      const fieldResult = normalizeValidities(validitiesOfFields[fieldName])
      if (fieldResult !== true) {
        acc[fieldName] = fieldResult
      }
      return acc
    }, {})
  }
  return isSimpleValid(validitiesOfFields)
}

export function isValid (normalizedValidities) {
  if (typeof normalizedValidities === 'boolean') {
    return normalizedValidities
  }
  if (Array.isArray(normalizedValidities)) {
    return normalizedValidities.every(isValid)
  }

  if (isPlainObject(normalizedValidities)) {
    return normalizedValidities.status !== ValidityStatus.ERROR
  }
  // never
}

export function isAllValid (normalizedValiditiesOfFields) {
  if (isPlainObject(normalizedValiditiesOfFields)) {
    return Object.keys(normalizedValiditiesOfFields).every((k) =>
      isValid(normalizedValiditiesOfFields[k])
    )
  }
  return isSimpleValid(normalizedValiditiesOfFields)
}
