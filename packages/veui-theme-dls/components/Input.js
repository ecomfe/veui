import { IconTimesCircle } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      clear: IconTimesCircle
    },
    ui: {
      style: {
        values: ['inline']
      },
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true
      }
    },
    parts: {
      clear: 'icon aux'
    }
  },
  'input'
)
