import { IconChevronLeft, IconChevronRight } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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
