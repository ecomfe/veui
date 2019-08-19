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
        values: ['vertical', 'labelVerticle']
      },
      size: {
        values: ['s']
      }
    }
  },
  'steps'
)
