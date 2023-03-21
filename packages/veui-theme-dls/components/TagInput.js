import { IconTimesCircle } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

const TAG_SIZE_MAP = {
  xs: 's',
  s: 's',
  m: 's',
  l: 'm'
}

ui.defaults(
  {
    icons: {
      clear: IconTimesCircle
    },
    ui: {
      size: {
        values: ['xs', 's', 'm', 'l'],
        inherit: true,
        default: 'm'
      }
    },
    parts: {
      clear: 'icon aux',
      tag: ({ size }) => TAG_SIZE_MAP[size] || size
    }
  },
  'taginput'
)
