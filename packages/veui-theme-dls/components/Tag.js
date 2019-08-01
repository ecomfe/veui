import config from 'veui/managers/config'
import 'veui-theme-one-icons/times'

config.defaults(
  {
    icons: {
      close: 'times'
    },
    ui: {
      style: {
        value: ['info', 'success', 'warning', 'error']
      },
      size: {
        values: ['s', 'm']
      }
    }
  },
  'tag'
)
