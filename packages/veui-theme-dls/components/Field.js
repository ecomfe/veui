import 'veui-theme-dls-icons/question-circle'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      tip: 'question-circle'
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
