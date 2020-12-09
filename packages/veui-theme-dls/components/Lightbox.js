import { IconChevronLeft, IconChevronRight, IconTimes } from 'dls-icons-vue'
import config from 'veui/managers/config'

config.defaults(
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
