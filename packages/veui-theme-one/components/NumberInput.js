import 'veui-theme-one-icons/chevron-up'
import 'veui-theme-one-icons/chevron-down'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    increase: 'chevron-up',
    decrease: 'chevron-down'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    }
  }
}, 'numberinput')
