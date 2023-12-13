/**
 * 用户直接使用 Provider， 接受一个 value prop 定义 context
 * 采用 Provider(functional) + ProviderImpl 方式实现的原因：
 *  1. 支持给多个子节点传递 context ： <Provider><a/><b/></Provider>
 *  2. functional 组件定义 provide 无效（inject 有效）
 */

import {
  uniqueId,
  isPlainObject,
  defaults,
  reduce,
  set,
  cloneDeep
} from 'lodash'

const DEEP_KEY_RE = /^([^.]+\.[^.]+)\.(.+)$/

export function createContext (name, defaultValue) {
  const realName = `${name || 'veui'}-provider`
  const contextId = `__${uniqueId(realName)}`

  function useProvider (valueKey = 'value', { override } = {}) {
    return {
      inject: {
        [contextId]: {
          from: contextId,
          default: () => () => undefined
        }
      },
      provide () {
        return {
          // provide 一个函数，该函数在消费方的 computed 调用，这样保证最终值依赖每个 provider 的 this.value
          [contextId]: () => {
            const parentContextValue = this[contextId]()
            const isObjParent = isPlainObject(parentContextValue)
            const isObjSelf = isPlainObject(this[valueKey])

            // this.value['button.ui'] 覆盖 parentContextValue['button.ui.*']
            if (isObjParent && isObjSelf) {
              Object.keys(parentContextValue).forEach((key) => {
                const match = key.match(DEEP_KEY_RE)
                if (match && typeof this[valueKey][match[1]] !== 'undefined') {
                  delete parentContextValue[key]
                }
              })
            }

            const base = override ? override.call(this) : {}

            return isObjParent && isObjSelf
              ? defaults(base, this[valueKey], parentContextValue) // 和上层合并
              : isObjSelf
                ? defaults(base, this[valueKey])
                : this[valueKey] // 无法合并，则以最近的 provider 为准
          }
        }
      }
    }
  }

  const ProviderImpl = {
    name: realName,
    uiTypes: ['transparent'],
    mixins: [useProvider()],
    props: {
      // eslint-disable-next-line vue/require-prop-types
      value: {}
    },
    render () {
      return this.$slots.default
    }
  }

  const Provider = {
    functional: true,
    // 这里实际上接受一个 value prop，用来传递 context，但是因为直接透传给 ProviderImpl，所以不用声明了
    render: (h, context) => wrapChildren(h, context, ProviderImpl)
  }

  function useConsumer (injectionKey) {
    return {
      inject: {
        [contextId]: {
          from: contextId,
          default: () => () => undefined
        }
      },
      computed: {
        [injectionKey] () {
          const value = this[contextId]()
          const isObj = isPlainObject(value)
          const [toMerge, deepKeys] = reduce(
            isObj ? value : undefined,
            (acc, val, key) => {
              const match = key.match(DEEP_KEY_RE)
              if (match) {
                acc[1].push(match)
              } else {
                acc[0][key] = val
              }
              return acc
            },
            [{}, []]
          )

          const defaultVal =
            typeof defaultValue === 'function' ? defaultValue() : defaultValue
          let result = typeof value === 'undefined' ? defaultVal : value
          if (isObj && isPlainObject(defaultVal)) {
            // 消费方获取 context 值时和初始值做合并, 先不要 deepKeys
            result = defaults({}, toMerge, defaultVal)
          }

          // deepKeys 设置进去: button.icons.loading -> set(button.icons, loading, value)
          if (deepKeys.length) {
            result = { ...result }
            deepKeys.forEach(([key, prefix, rest]) => {
              result[prefix] = result[prefix] ? cloneDeep(result[prefix]) : {}
              set(result[prefix], rest, value[key])
            })
          }

          return result
        }
      }
    }
  }

  const Consumer = {
    mixins: [useConsumer('context')],
    render () {
      return this.$scopedSlots.default(this.context)
    }
  }

  return { useProvider, useConsumer, Provider, Consumer }
}

function wrapChildren (h, { data, children }, Provider) {
  const value = data.attrs ? data.attrs.value : undefined
  return children.map((child) =>
    h(
      Provider,
      {
        attrs: { value } // 分开避免相互影响
      },
      [child]
    )
  )
}
