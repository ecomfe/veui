import 'veui-theme-dls-icons/upload'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/trash'
import 'veui-theme-dls-icons/check-circle'
import 'veui-theme-dls-icons/times-circle'
import 'veui-theme-dls-icons/file'
import 'veui-theme-dls-icons/image-add'
import 'veui-theme-dls-icons/exclamation-circle'
import 'veui-theme-dls-icons/loading'
import 'veui-theme-dls-icons/eye'
import 'veui-theme-dls-icons/question-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      upload: 'upload',
      clear: 'times',
      clearImage: 'trash',
      success: 'check-circle',
      failure: 'times-circle',
      file: 'file',
      imageAdd: 'image-add',
      alert: 'exclamation-circle',
      loading: 'loading',
      previewImage: 'eye',
      message: 'question-circle'
    },
    ui: {
      descPosition: {
        values: ['right-desc', 'bottom-desc'],
        default: 'right-desc'
      }
    },
    parts: {
      clearFileDone: 'text',
      retryImageSuccess: 'icon s',
      clearImageSuccess: 'icon s',
      progress: 's',
      messageTooltip: 'reverse',
      previewImage: 'icon s'
    }
  },
  'uploader'
)
