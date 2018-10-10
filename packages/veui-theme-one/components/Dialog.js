import '../icons/cross'

import config from 'veui/managers/config'

config.defaults({
  icons: {
    close: 'cross'
  },
  ui: {
    position: {
      values: ['top']
    }
  },
  parts: {
    ok: 'primary'
  }
}, 'dialog')
