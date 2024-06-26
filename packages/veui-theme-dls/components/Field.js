import { IconAsterisk, IconQuestionCircle } from 'dls-icons-vue'
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
    }
  },
  'field'
)
