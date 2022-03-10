import { reduce, forEach, isPlainObject } from 'lodash'
import Vue from 'vue'

export const ValidityType = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

const ValidityTypeOrder = {
  [ValidityType.SUCCESS]: 3,
  [ValidityType.WARNING]: 2,
  [ValidityType.ERROR]: 1
}

function createValidityMixinImpl () {
  return new Vue({
    data () {
      return {
        ruleValidities: {}, // Record<fieldName, Array<{type, name: ruleName, message}>>
        validatorValidities: {}, // Record<validatorName, {fieldName1: message, fieldName2: message2}>
        intrinsicValidities: {} // Record<fieldName, Array<{type, message}>>
      }
    },
    computed: {
      validities () {
        // => Record<fieldName, {message}>
        let result = reduce(
          this.validatorValidities,
          (acc, validities, validatorName) => {
            forEach(validities, (fieldValidities, fieldName) => {
              acc[fieldName] = (acc[fieldName] || []).concat(fieldValidities)
            })
            return acc
          },
          {}
        )

        result = mergeValidities(result, this.ruleValidities)
        return sortValidities(mergeValidities(result, this.intrinsicValidities))
      }
    },
    methods: {
      /**
       * @public
       * 获取指定字段的校验信息
       * @param {Array<string> | string} fields 指定字段
       * @return Array<Validity>
       */
      getValiditiesOfFields (fields) {
        fields = Array.isArray(fields) ? fields : [fields]
        return fields.reduce((acc, name) => {
          const fv = this.validities[name]
          if (fv) {
            return acc.concat(fv.map((item) => ({ ...item, fieldName: name })))
          }
          return acc
        }, [])
      },
      getRuleValidities (fieldName) {
        return this.ruleValidities[fieldName]
      },
      /**
       * 更新 rule 校验结果
       * @param {Array<string> | string} fieldName
       * @param {true | undefined | Array<string>} ruleNames
       * @param {true | undefined | Array<Validity>} validities
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
      updateIntrinsicValidities (fieldName, validities) {
        if (isPlainObject(validities)) {
          validities = [validities]
        }
        if (Array.isArray(validities)) {
          this.$set(this.intrinsicValidities, fieldName, validities)
        } else if (this.intrinsicValidities[fieldName] != null) {
          this.$delete(this.intrinsicValidities, fieldName)
        }
      },
      // 删掉指定 field 的指定 validity
      clearValiditiesOfField (fieldName) {
        this.$delete(this.ruleValidities, fieldName)
        this.$delete(this.intrinsicValidities, fieldName)
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
          getValiditiesOfFields: impl.getValiditiesOfFields,
          clearValiditiesOfField: impl.clearValiditiesOfField,
          updateRuleValidities: impl.updateRuleValidities,
          updateValidatorValidities: impl.updateValidatorValidities,
          updateIntrinsicValidities: impl.updateIntrinsicValidities
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
      (a, b) => ValidityTypeOrder[a.type] - ValidityTypeOrder[b.type]
    )
  })
  return validities
}

/*
 * type SimpleSuccess = true | null | undefined
 * type RuleResultSingle = SimpleSuccess | string | {type: ValidityType, message?: string}
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
  result.type = result.type || ValidityType.ERROR
  return result
}

/**
 * normalize 一个 field 的校验结果
 * @param {RuleResult} value 校验结果
 * @return true | Array<{type: ValidityType, message?: string}>
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
    return normalizedValidities.type !== ValidityType.ERROR
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
