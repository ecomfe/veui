import 'veui-theme-one-icons/check'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: 'check'
    },
    ui: {
      direction: {
        values: ['vertical']
      },
      style: {
        values: ['full']
      },
      size: {
        values: ['small']
      }
    }
  },
  'steps'
)
