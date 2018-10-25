import { getConfigKey } from '../utils/helper'
import i18n from '../managers/i18n'

export default {
  methods: {
    t (token, data) {
      return i18n.get(`${getConfigKey(this.$options.name)}.${token}`, data)
    }
  }}
