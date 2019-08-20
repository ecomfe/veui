import 'veui-theme-one-icons/times'

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
      width: {
        values: ['narrow', 'medium', 'wide', 'full'],
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
