import { isEmpty } from '../../utils/helper'
import i18n from '../i18n'

export default {
  validate (val, ruleValue) {
    return !isEmpty(val) ? val.length >= ruleValue : true
  },
  message (value, ruleValue) {
    return i18n.get('rules.minLength', { value, ruleValue })
  },
  priority: 100
}
