import {
  IconCheckCircle,
  IconExclamationCircle,
  IconInfoCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: IconCheckCircle,
      info: IconInfoCircle,
      error: IconTimesCircle,
      warning: IconExclamationCircle
    },
    parts: {
      ok: 'primary'
    }
  },
  'alertbox'
)
