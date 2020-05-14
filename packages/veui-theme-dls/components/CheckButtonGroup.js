import 'veui-theme-dls-icons/check'
import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    },
    parts: {
      button: 'basic'
    }
  },
  'checkbuttongroup'
)
