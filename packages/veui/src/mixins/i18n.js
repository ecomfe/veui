import { getConfigKey } from '../utils/helper'
import i18n from '../managers/i18n'

export default {
  methods: {
    t (token, data) {
      let key = getConfigKey(this.$options.name)
      return i18n.get(key ? `${key}.${token}` : token, data)
    }
  }}
