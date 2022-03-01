import { getTypedAncestor } from '../../utils/helper'
import { pick } from 'lodash'
import Vue from 'vue'

const pool = new Map()
const MAX_COUNT = 16
let poolSize = 0

export function useCoupled (parentType) {
  const bridgeKey = `__${parentType}Bridge`
  function asParent (defineFn) {
    return {
      uiTypes: [parentType],
      computed: {
        [bridgeKey] () {
          return defineFn(this)
        }
      }
    }
  }

  function asChild (namespace, register) {
    let mixin = {
      uiTypes: [`${parentType}-child`],
      computed: {
        [namespace] () {
          const parent = getTypedAncestor(this, parentType)
          return parent ? parent[bridgeKey] : null
        }
      }
    }

    if (register) {
      const cancelKey = `__${parentType}Cancel`
      mixin.created = function () {
        if (this[namespace]) {
          this[cancelKey] = register(this)
        }
      }
      mixin.destroyed = function () {
        if (typeof this[cancelKey] === 'function') {
          this[cancelKey]()
        }
      }
    }

    return mixin
  }

  return { asParent, asChild }
}

export function cacheFacade (facadeMaker) {
  return (vm) => vm.__facade || (vm.__facade = Object.freeze(facadeMaker(vm)))
}

export function createMixinFacade (options) {
  const exports = options.exports
  const implFactory = createMixinImpl(options)
  const isFn = typeof exports === 'function'
  return (namespace, deps) => {
    const implKey = `__${namespace}Impl`
    return {
      computed: {
        [namespace] () {
          let impl = reuseMixinImpl(options, deps) || implFactory(deps)
          impl.consumer = this
          this[implKey] = impl
          return isFn ? exports(impl) : pick(impl, exports)
        }
      },
      beforeDestroy () {
        cacheMixinImpl(options, this[implKey])
      }
    }
  }
}

function reuseMixinImpl (options, deps) {
  const caches = pool.get(options)
  let impl = null
  if (caches && caches.length) {
    impl = caches.pop()
    impl.clearState()
    impl.deps = Object.freeze(deps) // 更新下依赖，怕复用时有响应式问题
    poolSize--
  }
  return impl
}

function cacheMixinImpl (options, impl) {
  if (poolSize < MAX_COUNT) {
    let caches = pool.get(options) || []
    caches.push(impl)
    pool.set(options, caches)
    poolSize++
  }
}

function createMixinImpl (options) {
  return (deps) => {
    return new Vue({
      ...options,
      mixins: [
        {
          data () {
            return {
              deps: Object.freeze(deps),
              consumer: null
            }
          },
          methods: {
            clearState () {
              throw new Error(
                '[veui-mixin] A mixin implemention must define a `clearState` method for reusing.'
              )
            }
          }
        }
      ].concat(options.mixins || [])
    })
  }
}
