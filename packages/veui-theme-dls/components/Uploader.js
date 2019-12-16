import 'veui-theme-dls-icons/upload'
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
      clear: 'trash',
      success: 'check-circle',
      failure: 'times-circle',
      file: 'file',
      addImage: 'image-add',
      alert: 'exclamation-circle',
      loading: 'loading',
      preview: 'eye',
      message: 'question-circle'
    },
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      remove: 'icon',
      progress: 's',
      imageAction: 'icon s',
      preview: 'auto'
    }
  },
  'uploader'
)
