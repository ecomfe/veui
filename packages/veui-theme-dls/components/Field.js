import { IconQuestionCircle } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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
