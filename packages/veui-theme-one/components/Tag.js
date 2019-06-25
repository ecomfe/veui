import config from 'veui/managers/config'
import 'veui-theme-one-icons/times'

config.defaults(
  {
    icons: {
      close: 'times'
    },
    ui: {
      size: {
        values: ['large', 'small']
      }
    }
  },
  'tag'
)
