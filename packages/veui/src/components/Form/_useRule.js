import rule from '../../managers/rule'
import type from '../../managers/type'
import { ValidityType } from './_ValidityManager'

export default function useRule (namespace, { getRules, getFieldValue }) {
  return {
    computed: {
      [namespace] () {
        const {
          _getRules,
          _getInteractiveRuleRecord,
          _validateForEvent,
          _validate
        } = this
        return {
          getRules: _getRules,
          validateForEvent: _validateForEvent,
          getInteractiveRuleRecord: _getInteractiveRuleRecord,
          validate: _validate
        }
      },
      _realRules () {
        let rules = getRules(this)
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
      _interactiveRuleRecord () {
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
      _getRules () {
        return this._realRules
      },
      _getInteractiveRuleRecord () {
        return this._interactiveRuleRecord
      },
      _validateForEvent (formData, eventName) {
        if (this._interactiveRuleRecord[eventName]) {
          return this.validate(formData, this._interactiveRuleRecord[eventName])
        }
      },
      /**
       *
       * @param {*} formData 表单数据，因为ruleManager.validate需要
       * @param {Array<rule> | undefined} _rules
       * @return true | Array<Validity>
       */
      _validate (formData, _rules) {
        _rules = _rules || this._realRules
        let validities = true

        if (_rules) {
          // true | Array<{name?, message?}>
          validities = rule.validate(getFieldValue(this), _rules, formData)
        }

        return normalizeRuleResult(validities)
      }
    }
  }
}

/**
 * 统一 rule 验证结果
 * @param {true | Array<{name?: string, message?: string}>} result ruleManager 校验结果
 * @return {true | Array<{type: ValidityType, name?: string, message?: string}>}
 */
function normalizeRuleResult (result) {
  if (Array.isArray(result)) {
    return result.map((ruleResult) => {
      ruleResult.type = ruleResult.type || ValidityType.ERROR
      return ruleResult
    })
  }
  return result
}
