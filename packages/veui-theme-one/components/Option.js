import 'veui-theme-one-icons/check'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      checked: 'check'
    },
    ui: {
      style: {
        values: ['checkmark']
      }
    }
  },
  'option'
)
