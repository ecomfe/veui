import {
  IconCheckCircleSolid,
  IconExclamationCircleSolid,
  IconInfoCircleSolid,
  IconTimesCircleSolid,
  IconChevronLeft,
  IconChevronRight,
  IconTimes
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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
      prev: 'icon',
      next: 'icon',
      close: 'icon'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      },
      style: {
        values: ['strong']
      }
    }
  },
  'alert'
)
