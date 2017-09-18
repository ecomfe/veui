import { getConfigKey } from '../utils/helper'
import config from '../managers/config'

export default {
  computed: {
    icons () {
      return config.get(`${getConfigKey(this.$options.name)}.icons`)
    }
  }
}
