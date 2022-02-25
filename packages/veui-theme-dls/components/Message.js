import {
  IconCheckCircle,
  IconExclamationCircle,
  IconInfoCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheckCircle,
      info: IconInfoCircle,
      error: IconTimesCircle,
      warning: IconExclamationCircle
    }
  },
  'message'
)
