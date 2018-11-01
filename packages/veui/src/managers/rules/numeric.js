import { isNumber, toNumber, isNaN, isString } from 'lodash'
import { isEmpty } from '../../utils/helper'
import i18n from '../i18n'

export default {
  validate (val) {
    return !isEmpty(val)
      ? isNumber(val) || isString(val) && !/^0(?!\.|e)/.test(val) && !isNaN(toNumber(val))
      : true
  },
  message (value, ruleValue) {
    return i18n.get('rules.numeric', { value, ruleValue })
  },
  priority: 10
}
