import { isFalsy } from '../../utils/helper'

export default {
  validate (val) {
    return !isFalsy(val)
  },
  errMsg: '请填写',
  priority: 0
}
