import required from './rules/required'
import maxLength from './rules/maxLength'
import minLength from './rules/minLength'
import max from './rules/max'
import min from './rules/min'
import numeric from './rules/numeric'
import pattern from './rules/pattern'
import { isObject, isFunction } from 'lodash'

const replaceRe = /%\{ruleValue\}/g

export class Rule {
  constructor () {
    this.ruleValidators = {
      required,
      maxLength,
      minLength,
      max,
      min,
      numeric,
      pattern
    }
  }

  validate (val, rules) {
    if (!rules || !rules.length) {
      return true
    }

    rules = Array.isArray(rules) ? rules : [rules]
    let results = rules.map(rule => {
      let validator = this.ruleValidators[rule.name]
      if (!validator.validate(val, rule.value)) {
        return {
          name: rule.name,
          message: isFunction(rule.message)
            ? rule.message(rule.value)
            : ((rule.message || validator.message) + '').replace(
              replaceRe,
              rule.value
            )
        }
      }
      // 代表没错
      return true
    })

    // 只返回出错的就好
    results = results.filter(res => isObject(res))
    return results.length ? results : true
  }

  initRules (rules) {
    // 根据优先级排一下显示顺序
    rules.sort((x, y) => {
      let priorityX = x.priority || this.ruleValidators[x.name].priority
      let priorityY = y.priority || this.ruleValidators[y.name].priority
      return priorityX >= priorityY
    })
  }

  addRule (rule, validator) {
    if (!(rule in this.ruleValidators)) {
      this.ruleValidators[rule] = validator
    }
  }
}

export default new Rule()
