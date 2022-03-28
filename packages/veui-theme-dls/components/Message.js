import {
  IconCheckCircle,
  IconExclamationTriangleSolid,
  IconExclamationCircleSolid,
  IconInfoCircle,
  IconInfoCircleSolid
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheckCircle,
      error: IconExclamationCircleSolid,
      warning: IconExclamationTriangleSolid,
      info: IconInfoCircleSolid,
      aux: IconInfoCircle
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    }
  },
  'message'
)
