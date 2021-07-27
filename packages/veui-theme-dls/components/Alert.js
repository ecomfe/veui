import {
  IconCheckCircleSolid,
  IconExclamationCircleSolid,
  IconInfoCircleSolid,
  IconTimesCircleSolid,
  IconChevronLeft,
  IconChevronRight,
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
      prev: IconChevronLeft,
      next: IconChevronRight,
      close: IconTimes
    },
    parts: {
      prev: 'icon aux',
      next: 'icon aux',
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
  'alert'
)
