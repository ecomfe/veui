import {
  IconQuestionCircle,
  IconCheckCircle,
  IconExclamationCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      tip: IconQuestionCircle,
      success: IconCheckCircle,
      error: IconTimesCircle,
      warning: IconExclamationCircle,
      popup: IconExclamationCircle
    },
    ui: {
      size: {
        values: ['l', 'm', 's', 'xs'],
        inherit: true
      }
    },
    parts: {
      tip: 'alt'
    }
  },
  'field'
)
