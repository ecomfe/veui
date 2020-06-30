import { IconTriangleRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['m', 's'],
        inherit: true
      },
      'checkbox-after': {
        boolean: true
      }
    },
    icons: {
      collapse: IconTriangleRight,
      expand: IconTriangleRight
    }
  },
  'tree'
)
