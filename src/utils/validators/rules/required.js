import { isFalsely } from '../../helper'

export default {
  validate (val) {
    return !isFalsely(val)
  },
  errMsg: '请填写',
  priority: 0
}
