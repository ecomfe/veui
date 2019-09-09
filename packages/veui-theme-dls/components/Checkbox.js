import 'veui-theme-dls-icons/minus'
import 'veui-theme-dls-icons/check'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      indeterminate: 'minus',
      checked: 'check'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    }
  },
  'checkbox'
)
