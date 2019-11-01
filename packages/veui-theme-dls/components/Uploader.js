import 'veui-theme-dls-icons/upload'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/file'
import 'veui-theme-dls-icons/sync'
import 'veui-theme-dls-icons/plus'
import 'veui-theme-dls-icons/exclamation-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      upload: 'upload',
      clear: 'times',
      success: 'check',
      redo: 'sync',
      file: 'file',
      add: 'plus',
      alert: 'exclamation-circle'
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
  },
  'uploader'
)
