import '../icons/cross-small'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    remove: 'cross-small'
  },
  ui: {
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    }
  }
}, 'input')
