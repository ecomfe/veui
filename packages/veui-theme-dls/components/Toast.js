import {
  IconCheckCircle,
  IconExclamationCircle,
  IconInfoCircle,
  IconTimesCircle,
  IconTimes
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: IconCheckCircle,
      warning: IconExclamationCircle,
      info: IconInfoCircle,
      error: IconTimesCircle,
      close: IconTimes
    },
    parts: {
      close: 'icon'
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
