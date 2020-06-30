import { IconTimes } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      close: IconTimes
    },
    ui: {
      bordered: {
        boolean: true
      },
      reverse: {
        boolean: true
      },
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      close: 'icon'
    }
  },
  'tag'
)
