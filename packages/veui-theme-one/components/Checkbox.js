import '../icons/minus-small'
import '../icons/check-small'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    indeterminate: 'minus-small',
    checked: 'check-small'
  },
  ui: {
    size: {
      values: ['small']
    }
  }
}, 'checkbox')
