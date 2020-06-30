import {
  IconCheck,
  IconTimes,
  IconCheckCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      success: IconCheck,
      error: IconTimes,
      successBar: IconCheckCircle,
      errorBar: IconTimesCircle
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        data: {
          m: {
            radius: 54,
            strokeWidth: 6,
            strokeLinecap: 'round'
          },
          s: {
            radius: 54,
            strokeWidth: 4,
            strokeLinecap: 'round'
          }
        },
        inherit: true
      }
    }
  },
  'progress'
)
