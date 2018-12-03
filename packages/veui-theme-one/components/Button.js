import 'veui-theme-one-icons/spinner'
import config from 'veui/managers/config'

config.defaults({
  icons: {
    loading: 'spinner'
  },
  ui: {
    style: {
      values: ['alt', 'primary', 'dark']
    },
    role: {
      values: ['link']
    },
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    },
    shape: {
      values: ['round', 'square']
    }
  }
}, 'button')
