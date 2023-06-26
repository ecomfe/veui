import { assign } from 'lodash'

const CONTEXTUAL_STATUSES = ['success', 'info', 'error', 'warn']

export function makeContextualPopupApi (name, manager, method = 'show') {
  function getMethod (status) {
    return manager[status].bind(manager)
  }

  const METHODS = CONTEXTUAL_STATUSES.reduce((methods, name) => {
    methods[name] = getMethod(name)
    return methods
  }, {})

  return {
    install (Vue) {
      Vue.prototype[`$${name}`] = assign(manager[method].bind(manager), METHODS)
    }
  }
}

export function makePopupApi (name, manager, method = 'show') {
  return {
    install (Vue) {
      Vue.prototype[`$${name}`] = manager[method].bind(manager)
    }
  }
}
