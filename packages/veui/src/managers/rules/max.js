import { isNumber } from 'lodash'
import { isEmpty } from '../../utils/helper'
import i18n from '../i18n'

export default {
  validate (val, ruleValue) {
    return !isEmpty(val) && isNumber(val) ? val <= ruleValue : true
  },
  message (value, ruleValue) {
    return i18n.get('rules.max', { value, ruleValue })
  },
  priority: 200
}
