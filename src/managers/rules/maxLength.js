import { isFalsy } from '../../utils/helper'

export default {
  validate (val, ruleValue) {
    return !isFalsy(val) ? val.length <= ruleValue : true
  },
  errMsg: '字符长度不能超过%{ruleValue}',
  priority: 100
}
