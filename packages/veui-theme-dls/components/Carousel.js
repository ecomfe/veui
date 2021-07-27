import { IconChevronLeft, IconChevronRight } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    parts: {
      control: 'translucent'
    },
    icons: {
      prev: IconChevronLeft,
      next: IconChevronRight
    }
  },
  'carousel'
)
