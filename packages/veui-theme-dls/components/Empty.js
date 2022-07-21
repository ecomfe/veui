import ui from 'veui/managers/ui'
import { IllustrationSpotNoContent } from 'dls-illustrations-vue'

ui.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true,
        default: 'm'
      }
    },
    illustrations: {
      fallbackImage: IllustrationSpotNoContent
    }
  },
  'empty'
)
