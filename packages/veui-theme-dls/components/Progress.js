import {
  IconCheck,
  IconTimes,
  IconCheckCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import {
  dlsProgressSizeCircular,
  dlsProgressTrackWidthM,
  dlsProgressTrackWidthS
} from 'less-plugin-dls/variables'
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
            radius: parseInt(dlsProgressSizeCircular, 10) / 2,
            strokeWidth: parseInt(dlsProgressTrackWidthM),
            strokeLinecap: 'round'
          },
          s: {
            radius: parseInt(dlsProgressSizeCircular, 10) / 2,
            strokeWidth: parseInt(dlsProgressTrackWidthS, 10),
            strokeLinecap: 'round'
          }
        },
        inherit: true
      },
      fluid: {
        boolean: true
      }
    }
  },
  'progress'
)
