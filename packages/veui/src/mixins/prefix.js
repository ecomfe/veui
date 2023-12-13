import config from '../managers/config'
import { useConfigurable } from './config'

config.defaults({
  theme: null
})

function usePrefix () {
  return {
    mixins: [
      useConfigurable('themeConfig', {
        props: ['theme']
      })
    ],
    props: {
      theme: String
    },
    computed: {
      themeBase () {
        // ai is a variant of d22
        return this.realTheme === 'ai' ? 'd22' : this.realTheme
      },
      themeVariant () {
        return this.realTheme === 'ai' ? 'ai' : null
      }
    },
    methods: {
      $c (name) {
        return prefixify(name, this.themeVariant)
      }
    }
  }
}

const PREFIX_CONFIG = process.env.VEUI_PREFIX || process.env.VUE_APP_VEUI_PREFIX

export function prefixify (name, themeVariant) {
  return `${PREFIX_CONFIG || 'veui'}${
    themeVariant ? `-${themeVariant}` : ''
  }-${name}`
}

export default usePrefix()
