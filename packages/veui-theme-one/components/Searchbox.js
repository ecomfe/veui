import '../icons/search'
import '../icons/cross-small'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    search: 'search',
    clear: 'cross-small'
  },
  ui: {
    size: {
      values: ['large', 'small']
    }
  }
}, 'searchbox')
