import {
  IconAsterisk,
  IconQuestionCircle,
  IconQuestionCircleSolid
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      tip: IconQuestionCircle,
      required: IconAsterisk
    },
    ui: {
      size: {
        values: ['l', 'm', 's', 'xs'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      message: 's'
    },
    themes: {
      d22: {
        icons: {
          tip: IconQuestionCircleSolid
        }
      }
    }
  },
  'field'
)
