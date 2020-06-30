import {
  IconChevronUp,
  IconChevronDown,
  IconPlus,
  IconMinus
} from 'dls-icons-vue'
import config from 'veui/managers/config'

const ICON_MAP = {
  normal: {
    increase: IconChevronUp,
    decrease: IconChevronDown
  },
  strong: {
    increase: IconPlus,
    decrease: IconMinus
  }
}

config.defaults(
  {
    ui: {
      size: {
        values: ['xs', 's', 'm'],
        default: 'm',
        inherit: true
      },
      style: {
        values: ['normal', 'strong'],
        default: 'normal'
      }
    },
    parts: {
      spinner: 'basic'
    },
    icons: {
      increase: ({ style }) => ICON_MAP[style].increase,
      decrease: ({ style }) => ICON_MAP[style].decrease
    }
  },
  'numberinput'
)
