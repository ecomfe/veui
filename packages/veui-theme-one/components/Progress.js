import '../icons/check'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    success: 'check'
  },
  ui: {
    size: {
      values: ['tiny']
    }
  }
}, 'progress')
