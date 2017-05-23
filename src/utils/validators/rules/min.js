import { isFalsely } from '../../helper'

export default {
  validate (val, ruleValue) {
    return !isFalsely(val) ? val >= ruleValue : true
  },
  errMsg: '不能大于%{ruleValue}',
  priority: 200
}
