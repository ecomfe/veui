import { getConfigKey } from '../utils/helper'
import i18n from '../managers/i18n'

export default {
  methods: {
    t (token, data) {
      let [match, rootKey] = token.match(/^@([^@]+)$/) || []
      let key = match ? rootKey : `${getConfigKey(this.$options.name)}.${token}`
      return i18n.get(key, data)
    }
  }
}
