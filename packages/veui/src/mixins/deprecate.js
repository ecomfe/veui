import warn from '../utils/warn'
import { kebabCase } from 'lodash'

function getPropLink (component, prop) {
  if (!component || !prop) {
    return null
  }
  return `https://veui.dev/components/${component}#props-${prop}`
}

export function useRename (propDef, { from, to, component }) {
  const realKey = `real${to[0].toUpperCase()}${to.slice(1)}`
  const fromProp = kebabCase(from)
  const toProp = kebabCase(to)

  return {
    props: {
      [to]: propDef,
      [from]: propDef
    },
    created () {
      if (from in this.$options.propsData) {
        const name =
          component == null
            ? this.$options.name.replace(/^veui-/, '')
            : component
        const fromLink = getPropLink(name, fromProp)
        const toLink = getPropLink(name, toProp)
        const fromSuffix = fromLink ? ` (${fromLink})` : ''
        const toSuffix = toLink ? ` (${toLink})` : ''
        warn(
          `[${this.$options.name}] \`${fromProp}\` prop${fromSuffix} is deprecated and will be removed in future versions. Please use the \`${toProp}\` prop${toSuffix} instead.`,
          this
        )
      }
    },
    computed: {
      [realKey] () {
        if (to in this.$options.propsData) {
          return this[to]
        }
        return this[from]
      }
    }
  }
}
