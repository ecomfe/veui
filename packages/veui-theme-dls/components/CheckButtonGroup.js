import 'veui-theme-one-icons/check'
import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    },
    parts: {
      checked: 'primary'
    },
    icons: {
      check: 'check'
    }
  },
  'checkbuttongroup'
)
