import {
  IconCheck,
  IconTimes,
  IconCheckCircle,
  IconTimesCircle
} from 'dls-icons-vue'
import {
  dlsProgressSizeCircularM,
  dlsProgressSizeCircularS,
  dlsProgressSizeCircularXs,
  dlsProgressTrackWidthM,
  dlsProgressTrackWidthS,
  dlsProgressTrackWidthXs
} from 'less-plugin-dls/variables'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      success: IconCheck,
      error: IconTimes,
      successBar: IconCheckCircle,
      errorBar: IconTimesCircle
    },
    ui: {
      size: {
        values: ['xs', 's', 'm'],
        default: 'm',
        data: {
          m: {
            radius: parseInt(dlsProgressSizeCircularM, 10) / 2,
            strokeWidth: parseInt(dlsProgressTrackWidthM),
            strokeLinecap: 'round'
          },
          s: {
            radius: parseInt(dlsProgressSizeCircularS, 10) / 2,
            strokeWidth: parseInt(dlsProgressTrackWidthS, 10),
            strokeLinecap: 'round'
          },
          xs: {
            radius: parseInt(dlsProgressSizeCircularXs, 10) / 2,
            strokeWidth: parseInt(dlsProgressTrackWidthXs, 10),
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
