import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/times'
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
