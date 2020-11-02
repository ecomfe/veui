import {
  IconUpload,
  IconTrash,
  IconCheckCircle,
  IconTimesCircle,
  IconFile,
  IconImageAdd,
  IconVideoAdd,
  IconMediaAdd,
  IconExclamationCircle,
  IconLoading,
  IconEye,
  IconQuestionCircle
} from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      upload: IconUpload,
      clear: IconTrash,
      success: IconCheckCircle,
      failure: IconTimesCircle,
      file: IconFile,
      addImage: IconImageAdd,
      addVideo: IconVideoAdd,
      addMedia: IconMediaAdd,
      alert: IconExclamationCircle,
      loading: IconLoading,
      preview: IconEye,
      message: IconQuestionCircle
    },
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      remove: 'icon aux',
      progress: 's',
      control: 'icon m',
      entry: 'icon',
      preview: 'auto',
      media: 'basic'
    }
  },
  'uploader'
)
