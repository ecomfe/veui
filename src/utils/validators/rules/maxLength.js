import { isFalsely } from '../../helper'

export default {
  validate (val, ruleValue) {
    return !isFalsely(val) ? val.length <= ruleValue : true
  },
  errMsg: '字符长度不能超过%{ruleValue}',
  priority: 100
}
