import { IconLoading } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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
