import '../icons/upload'
import '../icons/cross'
import '../icons/check'
import '../icons/pin'
import '../icons/redo'
import '../icons/plus-huge'
import config from 'veui/managers/config'

config.defaults({
  'uploader.icons': {
    upload: 'upload',
    clear: 'cross',
    success: 'check',
    redo: 'redo',
    file: 'pin',
    add: 'plus-huge'
  }
})
