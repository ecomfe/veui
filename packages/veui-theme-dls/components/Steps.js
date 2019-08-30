import 'veui-theme-one-icons/check'
import 'veui-theme-one-icons/times'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: 'check',
      error: 'times'
    },
    ui: {
      direction: {
        values: ['vertical', 'label-vertical']
      },
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'steps'
)
