import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/times'
import 'veui-theme-dls-icons/chevron-right'
import config from 'veui/managers/config'

config.defaults(
  {
    icons: {
      checked: 'check',
      select: null,
      remove: 'times',
      collapse: 'chevron-right',
      expand: 'chevron-right',
      separator: 'chevron-right'
    },
    parts: {
      tree: 'checkbox-after',
      remove: 'icon'
    },
    ui: {
      size: {
        values: ['s', 'm'],
        inherit: true
      }
    }
  },
  'transfer'
)
