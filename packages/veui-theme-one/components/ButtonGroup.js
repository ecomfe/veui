import config from 'veui/managers/config'

config.defaults({
  ui: {
    style: {
      values: ['alt', 'primary']
    },
    size: {
      values: ['large', 'small', 'tiny', 'micro']
    }
  }
}, 'buttongroup')
