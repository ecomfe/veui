import {
  IconUpload,
  IconTrash,
  IconCheckCircle,
  IconTimesCircle,
  IconFile,
  IconImageAdd,
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
      remove: 'icon',
      progress: 's',
      control: 'icon s',
      preview: 'auto',
      image: 'basic'
    }
  },
  'uploader'
)
