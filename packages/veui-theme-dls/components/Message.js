import {
  IconCheckCircle,
  IconExclamationTriangleSolid,
  IconExclamationCircleSolid
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheckCircle,
      error: IconExclamationCircleSolid,
      warning: IconExclamationTriangleSolid
    }
  },
  'message'
)
