import { IconChevronLeft, IconChevronRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
  {
    parts: {
      control: 'translucent',
      outsideControl: 'basic'
    },
    icons: {
      prev: IconChevronLeft,
      next: IconChevronRight
    }
  },
  'carousel'
)
