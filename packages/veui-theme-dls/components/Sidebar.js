import {
  IconIndent,
  IconOutdent,
  IconChevronLeft,
  IconChevronRight
} from 'dls-icons-vue'
import ui from 'veui/managers/ui'

ui.defaults(
  {
    icons: {
      expand: IconIndent,
      collapse: IconOutdent,
      hiddenExpand: IconChevronRight,
      hiddenCollapse: IconChevronLeft
    }
  },
  'sidebar'
)
