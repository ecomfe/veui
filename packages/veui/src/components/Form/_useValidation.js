import rule from '../../managers/rule'
import type from '../../managers/type'
import { getTypedAncestorTracker } from '../../utils/helper'
import { uniq, includes } from 'lodash'
import { useValidationConsumer } from './_ValidationContext'

const { computed: form } = getTypedAncestorTracker('form')

/*
 * interactiveListeners
 * msgValidities
 * validity
 * form
 */

export default function validationConsumerFactory ({
  getFieldName,
  getFieldValue
}) {
  return {
    props: {
      rules: [String, Array]
    },
    mixins: [useValidationConsumer('validation')],
    computed: {
      _fieldName () {
        return getFieldName.call(this)
      },
      realRules () {
        if (!this.rules) {
          return null
        }

        let rules
        if (Array.isArray(this.rules)) {
          rules = type.clone(this.rules)
        } else {
          rules = this.rules
            .trim()
            .split(/\s+/)
            .map(perRule => ({
              name: perRule,
              value: true
            }))
        }
        rule.initRules(rules)
        return rules
      },
      validityNames () {
        return this._fieldName ? [this._fieldName] : []
        // const names = [].concat(
        //   this.realName || [],
        //   this.items.map(i => i.realName).filter(Boolean)
        // )
        // if (this.isFieldset) {
        //   return this.fieldset.items.reduce((acc, field) => {
        //     return field.isBubble ? acc.concat(field.validityNames) : acc
        //   }, names)
        // }
        // return names
      },
      realValidities () {
        return this.validityNames.reduce((acc, name) => {
          return acc.concat(this.validation.realValidities[name] || [])
        }, [])
      },
      msgValidities () {
        return this.realValidities.filter(({ message }) => !!message)
        // return this.isVerbose ? msg : msg.slice(0, 1)
      },
      validity () {
        const validity = this.realValidities[0]
        return {
          ...(validity || {}),
          valid: !validity
        }
      },
      // 用 event 来取该事件相关的 rules
      interactiveRulesMap () {
        let map = {}
        if (this.realRules) {
          this.realRules.forEach(({ triggers, name, message, value }) => {
            if (triggers) {
              if (typeof triggers === 'string') {
                triggers = triggers.split(',')
              }

              triggers.forEach(eventName => {
                if (eventName !== 'submit') {
                  map[eventName] = map[eventName] || []
                  map[eventName].push({
                    value,
                    name,
                    message
                  })
                }
              })
            }
          })
        }
        return map
      },
      interactiveListeners () {
        let allEvents = []
        if (this.form) {
          let events = this.form.fieldEvents[this._fieldName]
          if (events) {
            allEvents = allEvents.concat(events)
          }
        }
        allEvents = allEvents.concat(Object.keys(this.interactiveRulesMap))
        return uniq(allEvents).reduce((acc, eventName) => {
          acc[eventName] = () => this.handleInteract(eventName)
          return acc
        }, {})
      },
      ...form
    },
    created () {
      if (this._fieldName) {
        this.form.fields.push(this)
      }
    },
    beforeDestroy () {
      if (this._fieldName) {
        this.form.fields.splice(this.form.fields.indexOf(this), 1)
        this.validation.clearRuleValidities(this._fieldName)
      }
    },
    methods: {
      updateRuleValidities (val, ruleNames) {
        if (ruleNames) {
          this.validation.replaceRuleValidities(this._fieldName, ruleNames, val)
        } else if (val) {
          this.validation.updateRuleValidities(this._fieldName, val)
        } else {
          this.validation.removeRuleValidities(this._fieldName)
        }
      },
      validate (rules) {
        rules = rules || this.realRules
        let validities = true
        let prev = this.validation.getRuleValidities(this._fieldName)
        if (rules) {
          validities = rule.validate(
            getFieldValue.call(this),
            rules,
            this.form.data
          )
        } else if (prev) {
          // 没有 rules 了直接清空结果
          this.updateRuleValidities(null)
        }

        // 若之前也是验证成功，不用更新了
        if (!rules || (validities === true && !prev)) {
          return validities
        }

        let realValidities = validities === true ? [] : validities
        realValidities = realValidities
          .filter(({ name }) => !!name)
          .map(({ message, name }) => ({
            message,
            name
          }))

        this.updateRuleValidities(
          realValidities,
          rules.map(r => r.name)
        )
        return validities
      },
      handleInteract (eventName) {
        // 需要让对应的 data 更新完值之后，再去 validate，都要 nextTick 来保证
        this.$nextTick(() => {
          if (this.interactiveRulesMap[eventName]) {
            this.validate(this.interactiveRulesMap[eventName])
          }

          const name = this._fieldName
          if (
            this.form &&
            name &&
            includes(this.form.fieldEvents[name], eventName)
          ) {
            this.form.handleInteract(eventName, name)
          }
        })
      },
      hideValidity () {
        if (this._fieldName) {
          return this.validation.removeValidity(this._fieldName)
        }
      }
    }
  }
}
