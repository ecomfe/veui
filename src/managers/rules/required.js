import { isEmpty } from '../../utils/helper'

export default {
  validate (val) {
    return !isEmpty(val)
  },
  errMsg: '请填写',
  priority: 0
}
