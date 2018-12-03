import 'veui-theme-one-icons/times'

import config from 'veui/managers/config'

config.defaults({
  icons: {
    close: 'times'
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
