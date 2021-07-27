import { IconClock, IconTimesCircle } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      clock: IconClock,
      clear: IconTimesCircle
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    },
    parts: {
      clear: 'icon aux'
    }
  },
  'timepicker'
)
