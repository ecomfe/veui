import 'veui-theme-one-icons/check'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: 'check',
      error: 'times'
    },
    ui: {
      direction: {
        values: ['vertical']
      },
      style: {
        values: ['full']
      },
      size: {
        values: ['s']
      }
    }
  },
  'steps'
)
