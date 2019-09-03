import 'veui-theme-one-icons/upload'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/check'
import 'veui-theme-one-icons/paperclip'
import 'veui-theme-dls-icons/sync-alt'
import 'veui-theme-dls-icons/plus'
import 'veui-theme-dls-icons/exclamation-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      upload: 'upload',
      clear: 'times',
      success: 'check',
      redo: 'sync-alt',
      file: 'paperclip',
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
