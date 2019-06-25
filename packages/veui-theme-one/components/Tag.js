import config from 'veui/managers/config'
import '../icons/cross'

config.defaults(
  {
    icons: {
      close: 'cross'
    },
    ui: {
      size: {
        values: ['large', 'small']
      }
    }
  },
  'tag'
)
