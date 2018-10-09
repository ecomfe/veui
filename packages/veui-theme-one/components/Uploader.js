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
  },
  parts: {
    retryFileDone: 'link micro',
    clearFileDone: 'link square micro',
    cancelFile: 'link square micro',
    cancelImage: 'small',
    retryImageSuccess: 'dark',
    clearImageSuccess: 'dark square micro',
    retryImageFailure: 'small',
    clearImageFailure: 'link square micro'
  }
}, 'uploader')
