import '../icons/check'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    success: 'check'
  },
  ui: {
    size: {
      values: ['tiny'],
      data: {
        default: {
          radius: 60
        },
        tiny: {
          radius: 13
        }
      }
    }
  }
}, 'progress')
