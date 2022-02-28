import Vue from 'vue'
import { reduce, forEach } from 'lodash'

export const ValidityType = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}

export function getValidityManager () {
  return new Vue({
    data () {
      return {
        // TODO 合并结构
        ruleValidities: {}, // Record<fieldName, Array<{type, name: ruleName, message}>>
        validatorValidities: {}, // Record<validatorName, {fieldName1: message, fieldName2: message2}>
        intrinsicValidities: {} // Record<fieldName, Array<{type, message}>>
      }
    },
    computed: {
      validities () {
        // => Record<fieldName, {message}>
        const fromValidators = reduce(
          this.validatorValidities,
          (acc, validities, validatorName) => {
            forEach(validities, (fieldValidities, fieldName) => {
              acc[fieldName] = acc[fieldName] || []
              acc[fieldName] = acc[fieldName].concat(
                fieldValidities.map((fv) => ({
                  ...fv,
                  validator: validatorName,
                  validatorType: 'validator'
                }))
              )
            })
            return acc
          },
          {}
        )

        const fromRules = reduce(
          this.ruleValidities,
          (acc, validity, fieldName) => {
            acc[fieldName] = acc[fieldName] || []
            acc[fieldName] = [
              ...acc[fieldName],
              ...validity.map((fv) => ({
                ...fv,
                validator: fv.name,
                validatorType: 'rule'
              }))
            ]
            return acc
          },
          fromValidators
        )

        const fromInput = reduce(
          this.intrinsicValidities,
          (acc, validity, fieldName) => {
            acc[fieldName] = acc[fieldName] || []
            acc[fieldName] = [
              ...acc[fieldName],
              ...validity.map((fv) => ({
                ...fv,
                validator: fv.input,
                validatorType: 'intrinsic'
              }))
            ]
            return acc
          },
          fromRules
        )

        return fromInput
      }
    },
    methods: {
      /**
       * @public
       * 获取校验信息
       * @param {Array<string> | string} fields 指定字段
       * @return Array<Validity>
       */
      getValidities () {
        return this.validities
      },

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
        } else {
          this.clearRuleValidities(fieldName)
        }
      },
      clearRuleValidities (fieldName) {
        this.$delete(this.ruleValidities, fieldName)
      },
      updateValidatorValidities (validatorName, validities) {
        if (validities && Object.keys(validities).length) {
          this.$set(this.validatorValidities, validatorName, validities)
        } else {
          this.$delete(this.validatorValidities, validatorName)
        }
      },
      updateIntrinsicValidities (fieldName, validities) {
        if (validities && Object.keys(validities).length) {
          validities = [validities]
        }
        if (Array.isArray(validities)) {
          this.$set(this.intrinsicValidities, fieldName, validities)
        } else {
          this.$delete(this.intrinsicValidities, fieldName)
        }
      },
      // 删掉指定 field 的指定 validity
      clearValiditiesOfField (fieldName) {
        this.$delete(this.ruleValidities, fieldName)
        this.$delete(this.intrinsicValidities, fieldName)
        // 循环里面删key，所以先获取key
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
      },
      // form 用来reset
      clearValidities () {
        this.ruleValidities = {}
        this.validatorValidities = {}
        this.intrinsicValidities = {}
      }
    }
  })
}

export function isValid (value) {
  return value === true || value == null
}
