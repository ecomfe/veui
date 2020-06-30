import { IconTimes } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      close: IconTimes
    },
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      },
      dimension: {
        values: ['narrow', 'medium', 'wide', 'fullscreen', 'auto'],
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
