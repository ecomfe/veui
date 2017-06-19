import { isEmpty } from '../../utils/helper'

export default {
  validate (val, ruleValue) {
    return !isEmpty(val) ? val >= ruleValue : true
  },
  errMsg: '不能大于%{ruleValue}',
  priority: 200
}
