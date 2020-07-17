import {
  IconTimes,
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
  IconCheckCircle,
  IconExclamationCircle,
  IconInfoCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      remove: IconTimes,
      add: IconPlus,
      prev: IconChevronLeft,
      next: IconChevronRight,
      success: IconCheckCircle,
      warning: IconExclamationCircle,
      info: IconInfoCircle,
      error: IconTimesCircle
    },
    ui: {
      size: {
        values: ['s', 'm', 'l'],
        default: 'm',
        inherit: true
      },
      style: {
        values: ['simple', 'strong']
      }
    },
    parts: {
      remove: 'icon',
      add: 'text',
      nav: 'icon'
    }
  },
  'tabs'
)
