import ui from 'veui/managers/ui'
import { IconStarSolid } from 'dls-icons-vue'

ui.defaults(
  {
    parts: {
      tooltip: 'reverse'
    },
    icons: {
      symbol: IconStarSolid
    }
  },
  'rating'
)
