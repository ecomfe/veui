/**
 * 用户直接使用 Provider， 接受一个 provide prop 定义 context
 * 采用 Provider(functional) + ProviderImpl 方式实现的原因：
 *  1. 支持给多个子节点传递 context ： <Provider><a/><b/></Provider>
 *  2. functional 组件定义 provide vueOptions 无效
 */

import { uniqueId } from 'lodash'

const CommonProviderImpl = {
  name: 'provider', // for better readability in devtools
  uiTypes: ['transparent'],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {}
  },
  render () {
    return this.$slots.default
  }
}

export function createContext (name) {
  let scopedId = uniqueId(name || CommonProviderImpl.name)
  let RealProviderImpl = {
    ...CommonProviderImpl,
    provide () {
      return { [scopedId]: () => this.value }
    }
  }

  if (name) {
    RealProviderImpl.name = name
  }

  let Provider = {
    functional: true,
    // 这里实际上接受一个 value prop，用来传递 context，但是因为直接透传给 ProviderImpl，所以不用声明了
    render: (h, context) => wrapChildren(h, context, RealProviderImpl)
  }

  let useContext = (injection = 'injection') => {
    return {
      inject: {
        [scopedId]: {
          from: scopedId,
          default: () => () => undefined
        }
      },
      computed: {
        [injection] () {
          return this[scopedId]()
        }
      }
    }
  }

  return [Provider, useContext]
}

export const [SelectContextProvider, useSelectContext] = createContext(
  'SelectContext'
)

function wrapChildren (h, { data, children }, Provider) {
  return children.map(child =>
    h(
      Provider,
      {
        attrs: { value: data.attrs.value } // 分开避免相互影响
      },
      [child]
    )
  )
}
