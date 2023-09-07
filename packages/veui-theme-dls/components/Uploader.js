import {
  IconUpload,
  IconTrash,
  IconFile,
  IconImageAdd,
  IconImageSolid,
  IconVideoAdd,
  IconVideoSolid,
  IconMediaAdd,
  IconVideoFilmSolid,
  IconLoading,
  IconPlayCircle,
  IconZoomIn
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      upload: IconUpload,
      clear: IconTrash,
      file: IconFile,
      addImage: IconImageAdd,
      addVideo: IconVideoAdd,
      addMedia: IconMediaAdd,
      loading: IconLoading,
      previewImage: IconZoomIn,
      previewVideo: IconPlayCircle
    },
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      action: 'icon aux',
      progress: 's',
      control: 'icon m',
      entry: 'text',
      preview: 'auto',
      media: 'basic',
      message: 's'
    },
    themes: {
      d22: {
        icons: {
          addImage: IconImageSolid,
          addVideo: IconVideoSolid,
          addMedia: IconVideoFilmSolid
        },
        parts: {
          media: 'normal'
        }
      }
    }
  },
  'uploader'
)
