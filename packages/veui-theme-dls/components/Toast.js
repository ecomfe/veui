import {
  IconCheckCircle,
  IconExclamationCircle,
  IconInfoCircle,
  IconTimesCircle,
  IconTimes
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheckCircle,
      warning: IconExclamationCircle,
      info: IconInfoCircle,
      error: IconTimesCircle,
      close: IconTimes
    },
    parts: {
      close: 'icon aux'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    }
  },
  'toast'
)
