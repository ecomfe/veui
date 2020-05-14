import 'veui-theme-dls-icons/loading'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      loading: 'loading'
    },
    ui: {
      style: {
        values: [
          'normal',
          'basic',
          'translucent',
          'primary',
          'text',
          'text',
          'strong-text',
          'weak-text'
        ],
        default: 'normal'
      },
      strength: {
        values: ['strong', 'weak']
      },
      size: {
        values: ['xs', 's', 'm', 'l', 'xl'],
        default: 'm'
      }
    }
  },
  'button'
)
