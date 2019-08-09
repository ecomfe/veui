import 'veui-theme-one-icons/chevron-down'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      expand: 'chevron-down',
      collapse: 'chevron-down'
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      },
      style: {
        values: ['primary'],
        inherit: true
      },
      role: {
        values: ['text'],
        inherit: true
      }
    }
  },
  'dropdown'
)
