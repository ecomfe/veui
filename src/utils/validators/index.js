import required from './rules/required'
import maxLength from './rules/maxLength'
import minLength from './rules/minLength'
import maxByte from './rules/maxByte'
import minByte from './rules/minByte'
import max from './rules/max'
import min from './rules/min'
import numeric from './rules/numeric'
import pattern from './rules/pattern'
import { isEqual, map, includes } from 'lodash'

let ruleValidators = {
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

const replaceRe = /%\{ruleValue\}/g

export default {
  validate (val, rules) {
    if (!rules || !rules.length) {
      return true
    }

    let err
    rules = Array.isArray(rules) ? rules : [rules]
    return rules.some(rule => {
      let validator = ruleValidators[rule.name]
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
  },

  initRules (rules) {
    rules.sort(sortRule)
  },

  diffRules (newRules, oldRules) {
    let ruleNames = map(oldRules, 'name')
    let removed = []
    let added = newRules.filter(newRule => {
      // 过滤出新添加和更新的
      return !oldRules.some(oldRule => {
        let equal = isEqual(newRule, oldRule)
        if (equal) {
          // 没有改变的直接去掉，跳出遍历
          return true
        }
        if (!equal && !includes(ruleNames, newRule.name)) {
          // 改变了的要看是不是新加的，查一下之前有没有这条规则，有的话说明是修改，标记为去掉
          removed.push(oldRule)
        }
        return false
      })
    })

    return {
      added,
      removed
    }
  }
}

export function addRule (rule, validator) {
  if (!(rule in ruleValidators)) {
    ruleValidators[rule] = validator
  }
}

function sortRule (x, y) {
  return ruleValidators[x.name].priority >= ruleValidators[y.name].priority
}
