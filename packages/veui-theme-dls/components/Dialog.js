import { IconTimes } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
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
      close: 'icon aux'
    }
  },
  'dialog'
)
