import required from './rules/required'
import maxLength from './rules/maxLength'
import minLength from './rules/minLength'
import maxByte from './rules/maxByte'
import minByte from './rules/minByte'
import max from './rules/max'
import min from './rules/min'
import numeric from './rules/numeric'
import pattern from './rules/pattern'
import {isObject} from 'lodash'

const replaceRe = /%\{ruleValue\}/g

export class Rule {
  constructor () {
    this.ruleValidators = {
      required,
      maxLength,
      minLength,
      maxByte,
      minByte,
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
          message: (rule.message || validator.message).replace(replaceRe, rule.value)
        }
      }
      // 代表没错
      return true
    })
    return results.some(res => isObject(res))
      ? results
      : true
  }

  initRules (rules) {
    // 根据优先级排一下显示顺序
    rules.sort((x, y) => {
      return this.ruleValidators[x.name].priority >= this.ruleValidators[y.name].priority
    })
  }

  addRule (rule, validator) {
    if (!(rule in this.ruleValidators)) {
      this.ruleValidators[rule] = validator
    }
  }
}

export default new Rule()
