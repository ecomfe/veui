import { IconTimes } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
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
