import { isNumber, toNumber, isNaN } from 'lodash'
import { isFalsely } from '../../helper'

export default {
  validate (val) {
    return !isFalsely(val)
      ? isNumber(val) || !isNaN(toNumber(val))
      : true
  },
  errMsg: '值必须为数字',
  priority: 10
}
