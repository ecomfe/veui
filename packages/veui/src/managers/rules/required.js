import { isEmpty } from '../../utils/helper'
import i18n from '../i18n'

export default {
  validate (val) {
    return !isEmpty(val)
  },
  message (value, ruleValue) {
    return i18n.get('rules.required', { value, ruleValue })
  },
  priority: 0
}
