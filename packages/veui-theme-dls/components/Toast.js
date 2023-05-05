import {
  IconCheckCircleSolid,
  IconExclamationCircleSolid,
  IconInfoCircleSolid,
  IconTimesCircleSolid,
  IconTimes
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheckCircleSolid,
      warning: IconExclamationCircleSolid,
      info: IconInfoCircleSolid,
      error: IconTimesCircleSolid,
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
