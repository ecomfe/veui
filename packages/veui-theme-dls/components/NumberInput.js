import 'veui-theme-dls-icons/chevron-up'
import 'veui-theme-dls-icons/chevron-down'
import 'veui-theme-dls-icons/plus'
import 'veui-theme-dls-icons/minus'
import config from 'veui/managers/config'

const ICON_MAP = {
  normal: {
    increase: 'chevron-up',
    decrease: 'chevron-down'
  },
  strong: {
    increase: 'plus',
    decrease: 'minus'
  }
}

config.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm'],
        inherit: true
      },
      style: {
        values: ['normal', 'strong'],
        default: 'normal'
      }
    },
    parts: {
      spinner: ''
    },
    icons: ({ style }) => {
      return ICON_MAP[style] || {}
    }
  },
  'numberinput'
)
