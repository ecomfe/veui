import './locale/zh-Hans'
import './locale/en-US'
import * as components from './components/index'
import * as plugins from './plugins/index'

export * from './index'

export function install (Vue, { prefix } = {}) {
  Object.keys(components).forEach((key) => {
    const component = components[key]
    let name = component.name
    if (typeof prefix === 'string') {
      name = component.name.replace(/^veui-/, prefix ? `${prefix}-` : '')
    }
    Vue.component(name, component)
  })

  Object.keys(plugins).forEach((key) => {
    const plugin = plugins[key]
    Vue.use(plugin)
  })
}
