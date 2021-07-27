import { IconQuestionCircle } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      tip: IconQuestionCircle
    },
    ui: {
      size: {
        values: ['l', 'm', 's', 'xs'],
        inherit: true
      }
    },
    parts: {
      tip: 'alt'
    }
  },
  'field'
)
