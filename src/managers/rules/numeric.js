import { isNumber, toNumber, isNaN } from 'lodash'
import { isEmpty } from '../../utils/helper'

export default {
  validate (val) {
    return !isEmpty(val)
      ? isNumber(val) || !isNaN(toNumber(val))
      : true
  },
  message: '值必须为数字',
  priority: 10
}
