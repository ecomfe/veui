import { isType, getTypeByInstance } from '../../utils/lang'

export default {
  validate (val, ruleValue) {
    return isType(getTypeByInstance(ruleValue), RegExp)
      ? ruleValue.test(val)
      : new RegExp(ruleValue).test(val)
  },
  msg: '格式不符合要求',
  priority: 10
}
