import required from './rules/required'
import maxLength from './rules/maxLength'
import minLength from './rules/minLength'
import maxByte from './rules/maxByte'
import minByte from './rules/minByte'
import max from './rules/max'
import min from './rules/min'
import numeric from './rules/numeric'
import pattern from './rules/pattern'

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

    let err
    rules = Array.isArray(rules) ? rules : [rules]
    return rules.some(rule => {
      let validator = this.ruleValidators[rule.name]
      if (!validator.validate(val, rule.value)) {
        err = (rule.errMsg || validator.errMsg).replace(replaceRe, rule.value)
        // 代表有错
        return true
      }
      // 代表没错
      return false
    })
    ? err
    : true
  }

  initRules (rules) {
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
