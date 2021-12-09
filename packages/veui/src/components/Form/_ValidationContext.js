import Vue from 'vue'
import { createContext } from '../../managers/context'
import { reduce, forEach } from 'lodash'

let { Provider, Consumer, useConsumer } = createContext('form-context')

export function getValidation () {
  return new Vue({
    data () {
      return {
        ruleValidities: Object.create(null), // Record<fieldName, Array<{name: ruleName, message}>>
        validatorValidities: Object.create(null) // Record<validatorName, {fieldName1: message, fieldName2: message2}>
      }
    },
    computed: {
      realValidities () {
        // => Record<fieldName, {message}>
        const fromValidators = reduce(
          this.validatorValidities,
          (acc, vali, validatorName) => {
            forEach(vali, (message, name) => {
              acc[name] = acc[name] || []
              acc[name].push({
                message,
                source: validatorName,
                sourceType: 'validator'
              })
            })
            return acc
          },
          {}
        )

        const fromRules = reduce(
          this.ruleValidities,
          (acc, vali, name) => {
            acc[name] = acc[name] || []
            acc[name] = [
              ...acc[name],
              ...vali.map(({ message }) => ({
                message,
                source: name,
                sourceType: 'rule'
              }))
            ]
            return acc
          },
          fromValidators
        )

        return fromRules
      }
    },
    methods: {
      hasRuleValidity (fieldName) {
        return !!this.getRuleValidities(fieldName)
      },
      getRuleValidities (fieldName) {
        return this.ruleValidities[fieldName]
      },
      updateRuleValidities (fieldName, validity) {
        this.$set(this.ruleValidities, fieldName, validity)
      },
      clearRuleValidities (fieldName) {
        this.$delete(this.ruleValidities, fieldName)
      },
      replaceRuleValidities (fieldName, ruleNames, validity) {
        // todo 以前也没有保证顺序
        const prev = (this.ruleValidities[fieldName] || []).filter(
          ({ name }) => ruleNames.indexOf(name) === -1
        )
        const newValidity = [...validity, ...prev]
        this.updateRuleValidities(fieldName, newValidity)
      },
      updateValidatorValidities (validatorName, validity) {
        this.$set(this.validatorValidities, validatorName, validity)
      },
      // 删掉指定 field 的指定 validity
      removeValidity (fieldName) {
        Vue.delete(this.ruleValidities, fieldName)
        // 循环里面删key，所以先获取key
        Object.keys(this.validatorValidities).forEach(validatorName => {
          let validity = this.validatorValidities[validatorName]
          if (validity[fieldName]) {
            if (Object.keys(validity).length === 1) {
              Vue.delete(this.validatorValidities, validatorName)
            } else {
              Vue.delete(validity, fieldName)
            }
          }
        })
      },
      // form 用来reset
      clearValidity () {
        this.ruleValidities = {}
        this.validatorValidities = {}
      }
    }
  })
}

export {
  Provider as ValidationProvider,
  Consumer as ValidationConsumer,
  useConsumer as useValidationConsumer
}
