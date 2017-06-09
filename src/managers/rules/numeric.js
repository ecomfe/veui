import { isNumber, toNumber, isNaN } from 'lodash'
import { isFalsy } from '../../utils/helper'

export default {
  validate (val) {
    return !isFalsy(val)
      ? isNumber(val) || !isNaN(toNumber(val))
      : true
  },
  errMsg: '值必须为数字',
  priority: 10
}
