import { IconTimes } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      remove: IconTimes
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
      remove: 'icon aux'
    }
  },
  'tag'
)
