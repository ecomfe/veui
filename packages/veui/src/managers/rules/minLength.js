import { isEmpty } from '../../utils/helper'

export default {
  validate (val, ruleValue) {
    return !isEmpty(val) ? val.length >= ruleValue : true
  },
  message: '字符长度不能短于%{ruleValue}',
  priority: 100
}
