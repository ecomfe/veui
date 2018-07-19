import { isEmpty } from '../../utils/helper'
import { isNumber } from 'lodash'

export default {
  validate (val, ruleValue) {
    return !isEmpty(val) && isNumber(val) ? val >= ruleValue : true
  },
  message: '不能小于${ruleValue}',
  priority: 200
}
