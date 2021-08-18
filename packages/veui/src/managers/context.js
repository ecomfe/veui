/**
 * 用户直接使用 Provider， 接受一个 value prop 定义 context
 * 采用 Provider(functional) + ProviderImpl 方式实现的原因：
 *  1. 支持给多个子节点传递 context ： <Provider><a/><b/></Provider>
 *  2. functional 组件定义 provide 无效（inject 有效）
 */

import { uniqueId, isPlainObject, assign } from 'lodash'

const CommonProviderImpl = {
  name: 'veui-provider', // for better readability in devtools
  uiTypes: ['transparent'],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {}
  },
  render () {
    return this.$slots.default
  }
}

export function createContext (name, defaultValue) {
  const realName = name ? `${name}-provider` : CommonProviderImpl.name
  let contextId = `__${uniqueId(realName)}`
  let RealProviderImpl = {
    ...CommonProviderImpl,
    name: realName,
    inject: {
      [contextId]: {
        from: contextId,
        default: () => () => {}
      }
    },
    provide () {
      return {
        [contextId]: () => {
          let parentContextValue = this[contextId]()
          if (
            isPlainObject(parentContextValue) &&
            isPlainObject(this.value) // provide 的值时函数，最后在消费方的 computed 调用，这样保证最终值依赖每个 provider 的 this.value
          ) {
            return assign({}, parentContextValue, this.value) // 每层 provider 都会和上一层的值合并
          }
          // 无法合并，则以最近的 provider 为准
          return this.value
        }
      }
    }
  }

  let Provider = {
    functional: true,
    // 这里实际上接受一个 value prop，用来传递 context，但是因为直接透传给 ProviderImpl，所以不用声明了
    render: (h, context) => wrapChildren(h, context, RealProviderImpl)
  }

  let useConsumer = injectionKey => {
    return {
      inject: {
        [contextId]: {
          from: contextId,
          default: () => () => undefined
        }
      },
      computed: {
        [injectionKey] () {
          if (defaultValue) {
            defaultValue =
              typeof defaultValue === 'function' ? defaultValue() : defaultValue
            // 消费方获取 context 值时和初始值做合并
            return assign({}, defaultValue, this[contextId]())
          }
          return this[contextId]()
        }
      }
    }
  }

  let Consumer = {
    ...useConsumer('context'),
    render () {
      return this.$scopedSlots.default(this.context)
    }
  }

  return { Provider, Consumer, useConsumer }
}

function wrapChildren (h, { data, children }, Provider) {
  const value = data.attrs ? data.attrs.value : undefined
  return children.map(child =>
    h(
      Provider,
      {
        attrs: { value } // 分开避免相互影响
      },
      [child]
    )
  )
}
