import 'veui-theme-one-icons/minus'
import 'veui-theme-one-icons/check'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    indeterminate: 'minus',
    checked: 'check'
  },
  ui: {
    size: {
      values: ['small']
    }
  }
}, 'checkbox')
