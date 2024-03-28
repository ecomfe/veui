import warn, { getLink } from '../utils/warn'
import { kebabCase } from 'lodash'

export function useRename (
  propDef,
  { from, to, component, hasFromLink = true }
) {
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
        const fromLink = hasFromLink ? getLink(name, fromProp) : null
        const toLink = getLink(name, toProp)
        const fromSuffix = fromLink ? ` (${fromLink})` : ''
        const toSuffix = toLink ? ` (${toLink})` : ''
        warn(
          `[${this.$options.name}] The \`${fromProp}\` prop${fromSuffix} is deprecated and will be removed in future versions. Please use the \`${toProp}\` prop${toSuffix} instead.`,
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
