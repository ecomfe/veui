import '../icons/upload'
import '../icons/cross'
import '../icons/check'
import '../icons/clip'
import '../icons/refresh'
import '../icons/plus-huge'
import '../icons/exclamation-circle-o'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    upload: 'upload',
    clear: 'cross',
    success: 'check',
    redo: 'refresh',
    file: 'clip',
    add: 'plus-huge',
    alert: 'exclamation-circle-o'
  },
  ui: {
    direction: {
      values: ['horizontal']
    }
  }
}, 'uploader')
