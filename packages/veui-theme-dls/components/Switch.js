import { IconLoading } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      loading: IconLoading
    },
    ui: {
      size: {
        values: ['xs', 's', 'm']
      }
    }
  },
  'switch'
)
