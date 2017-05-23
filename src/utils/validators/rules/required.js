import { isFalsely } from '../../helper'

export default {
  validate (val) {
    return !isFalsely(val)
  },
  errMsg: '该项必须填写',
  priority: 0
}
