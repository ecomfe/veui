import rule from '../../managers/rule'
import type from '../../managers/type'
import { normalizeValidities } from './_useValidity'
import { createMixinFacade } from './_facade'

export default createMixinFacade({
  exports: [
    // 暴露的keys
    'getRules',
    'validateForEvent',
    'getInteractiveRuleRecord',
    'validate'
  ],
  computed: {
    realRules () {
      let rules = this.deps.getRules(this.consumer)
      if (!rules) {
        return []
      }

      if (Array.isArray(rules)) {
        rules = type.clone(rules)
      } else {
        rules = rules
          .trim()
          .split(/\s+/)
          .map((perRule) => ({
            name: perRule,
            value: true
          }))
      }
      rule.initRules(rules)
      return rules
    },
    // Record<eventName, rule>
    interactiveRuleRecord () {
      let record = {}
      if (this.realRules) {
        this.realRules.forEach(({ triggers, name, message, value }) => {
          if (triggers) {
            if (typeof triggers === 'string') {
              triggers = triggers.split(',')
            }

            triggers.forEach((eventName) => {
              if (eventName !== 'submit') {
                record[eventName] = record[eventName] || []
                record[eventName].push({
                  value,
                  name,
                  message
                })
              }
            })
          }
        })
      }
      return record
    }
  },
  methods: {
    getRules () {
      return this.realRules
    },
    getInteractiveRuleRecord () {
      return this.interactiveRuleRecord
    },
    validateForEvent (formData, eventName) {
      const rules = this.interactiveRuleRecord[eventName]
      if (rules) {
        return this.validate(formData, rules)
      }
    },
    /**
     *
     * @param {*} formData 表单数据，因为ruleManager.validate需要
     * @param {Array<rule> | undefined} _rules
     * @return true | Array<Validity>
     */
    validate (formData, rules) {
      rules = rules || this.realRules
      let validities = true

      if (rules) {
        // true | Array<{name?, message?}>
        validities = rule.validate(
          this.deps.getFieldValue(this.consumer),
          rules,
          formData
        )
      }

      return normalizeValidities(validities)
    },
    clearState () {
      // for override
    }
  }
})
