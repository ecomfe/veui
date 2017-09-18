import '../icons/upload'
import '../icons/cross'
import '../icons/check-circle'
import config from 'veui/managers/config'

config.defaults({
  'uploader.icons': {
    upload: 'upload',
    clear: 'cross',
    success: 'check-circle'
  }
})
