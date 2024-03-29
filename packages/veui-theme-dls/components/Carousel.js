import { IconChevronLeft, IconChevronRight } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    parts: {
      control: 'translucent',
      controlOutside: 'basic'
    },
    icons: {
      prev: IconChevronLeft,
      next: IconChevronRight
    }
  },
  'carousel'
)
