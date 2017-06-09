import { isFalsy } from '../../utils/helper'

export default {
  validate (val, ruleValue) {
    return !isFalsy(val) ? val <= ruleValue : true
  },
  errMsg: '不能小于%{ruleValue}',
  priority: 200
}
