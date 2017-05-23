import { isFalsely } from '../../helper'

export default {
  validate (val, ruleValue) {
    return !isFalsely(val) ? val <= ruleValue : true
  },
  errMsg: '不能小于%{ruleValue}',
  priority: 200
}
