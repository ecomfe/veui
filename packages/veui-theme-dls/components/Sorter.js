import 'veui-theme-dls-icons/arrow-up'
import 'veui-theme-dls-icons/arrow-down'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      asc: 'arrow-up',
      desc: 'arrow-down'
    }
  },
  'sorter'
)
