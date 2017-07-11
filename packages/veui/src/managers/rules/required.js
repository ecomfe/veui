import { isEmpty } from '../../utils/helper'

export default {
  validate (val) {
    return !isEmpty(val)
  },
  message: '请填写',
  priority: 0
}
