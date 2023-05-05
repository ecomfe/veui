import {
  IconCheckCircleSolid,
  IconExclamationCircleSolid,
  IconInfoCircleSolid,
  IconTimesCircleSolid
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheckCircleSolid,
      info: IconInfoCircleSolid,
      error: IconTimesCircleSolid,
      warning: IconExclamationCircleSolid
    },
    parts: {
      ok: 'primary'
    }
  },
  'alertbox'
)
