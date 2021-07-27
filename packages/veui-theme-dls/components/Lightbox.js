import { IconChevronLeft, IconChevronRight, IconTimes } from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      close: IconTimes,
      prev: IconChevronLeft,
      next: IconChevronRight
    },
    parts: {
      close: 'icon',
      control: 'translucent'
    }
  },
  'lightbox'
)
