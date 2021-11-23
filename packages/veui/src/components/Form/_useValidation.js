import rule from '../../managers/rule'
import type from '../../managers/type'
import { getTypedAncestorTracker } from '../../utils/helper'
import { uniq, includes } from 'lodash'

const { computed: form } = getTypedAncestorTracker('form')

export default function validationMixinFactory ({
  getName,
  getFieldValue,
  updateRuleValidities,
  getRuleValidities
}) {
  return {
    props: {
      rules: [String, Array]
    },
    computed: {
      realName () {
        return getName.call(this)
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
          let events = this.form.fieldEvents[this.realName]
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
    methods: {
      getFieldValue () {
        return getFieldValue.call(this)
      },
      validate (rules) {
        rules = rules || this.realRules
        let validities = true
        let prev = getRuleValidities.call(this)
        if (rules) {
          validities = rule.validate(
            this.getFieldValue(),
            rules,
            this.form.data
          )
        } else if (prev) {
          // 没有 rules 了直接清空结果
          updateRuleValidities.call(this, null)
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

        updateRuleValidities.call(
          this,
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

          if (
            this.form &&
            this.realName &&
            includes(this.form.fieldEvents[this.realName], eventName)
          ) {
            this.form.$emit('interact', eventName, this.realName)
          }
        })
      },
      hideValidity () {
        return this.validation.removeValidity(this.realName)
      }
    },
    beforeDestroy () {
      if (this.realName && this.validation) {
        this.validation.clearRuleValidities(this.realName)
      }
    }
  }
}
