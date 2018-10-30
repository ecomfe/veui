import { getConfigKey } from '../utils/helper'
import i18n from '../managers/i18n'

export default {
  methods: {
    t (token, data) {
      let key = token
      let [match, rootKey] = token.match(/^@([^@]+)$/) || []
      if (match) {
        key = rootKey
      } else {
        key = `${getConfigKey(this.$options.name)}.${token}`
      }
      return i18n.get(key, data)
    }
  }}
