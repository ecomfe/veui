import { isEmpty } from '../../utils/helper'

export default {
  validate (val, ruleValue) {
    return !isEmpty(val) ? val.replace(/[^\x00-\xff]/g, 'xxx').length <= ruleValue : true
  },
  message: '字节长度不能超过%{ruleValue}',
  priority: 100
}
