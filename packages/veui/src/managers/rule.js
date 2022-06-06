import Vue from 'vue'
import { isObject, isFunction } from 'lodash'
import required from './rules/required'
import maxLength from './rules/maxLength'
import minLength from './rules/minLength'
import max from './rules/max'
import min from './rules/min'
import numeric from './rules/numeric'
import pattern from './rules/pattern'
import { renderTpl } from '../utils/helper'
import type from './type'

const DEFAULT_PRI = 200
export class Rule {
  constructor () {
    this.ruleValidators = new Vue({
      data: {
        required,
        maxLength,
        minLength,
        max,
        min,
        numeric,
        pattern
      }
    })
  }

  validate (val, rules, context) {
    if (!rules || !rules.length) {
      return true
    }

    rules = Array.isArray(rules) ? rules : [rules]
    let contextData = type.clone(context)
    let results = rules.map((rule) => {
      const { name, value: ruleValue, message } = rule
      let validator = this.ruleValidators[name] || rule
      if (!isFunction(validator.validate)) {
        throw new Error('rule validate is required')
      }

      if (!validator.validate(val, ruleValue, contextData)) {
        let realMessage = message || validator.message
        return {
          name: name,
          message: isFunction(realMessage)
            ? realMessage(val, ruleValue)
            : realMessage
              ? renderTpl(realMessage, { ruleValue, value: val }, true)
              : ''
        }
      }
      // 代表没错
      return true
    })

    // 只返回出错的就好
    results = results.filter((res) => isObject(res))
    return results.length ? results : true
  }

  initRules (rules) {
    // 根据优先级排一下显示顺序
    rules.sort((x, y) => {
      return this.getPriority(x) >= this.getPriority(y)
    })
  }

  addRule (rule, validator) {
    if (!(rule in this.ruleValidators)) {
      this.ruleValidators[rule] = validator
    }
  }

  getPriority ({ priority, name }) {
    // 0
    if (priority != null) {
      return priority
    }
    const rule = this.ruleValidators[name]
    if (rule && rule.priority != null) {
      return rule.priority
    }

    return DEFAULT_PRI
  }
}

export default new Rule()
