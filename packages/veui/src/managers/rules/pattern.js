import { isType, getTypeByInstance } from '../../utils/lang'
import i18n from '../i18n'

export default {
  validate (val, ruleValue) {
    return isType(getTypeByInstance(ruleValue), RegExp)
      ? ruleValue.test(val)
      : new RegExp(ruleValue).test(val)
  },
  message (value, ruleValue) {
    return i18n.get('rules.pattern', { value, ruleValue })
  },
  priority: 50
}
