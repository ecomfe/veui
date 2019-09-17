import 'veui-theme-dls-icons/times'

import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      close: 'times'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      },
      dimension: {
        values: ['narrow', 'medium', 'wide', 'full', 'auto'],
        default: 'medium'
      }
    },
    parts: {
      ok: 'primary',
      close: 'icon'
    }
  },
  'dialog'
)
