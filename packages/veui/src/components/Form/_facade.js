import { getTypedAncestor } from '../../utils/helper'

/**
 * 当组件之间通信时，显式地将 API 定义出来比较容易维护，故引入门面（Facade）。
 * 这里的 API 是组件库内部组件之间使用，并非对组件库使用方暴露。
 *
 * @param {Function} defineFacade 定义函数，返回值就是对外的门面
 * @return mixin
 */
export function useFacade (defineFacade) {
  const facadeKey = '__facade'
  return {
    computed: {
      [facadeKey] () {
        return defineFacade(this)
      }
    },
    methods: {
      // @public
      getFacade () {
        return this[facadeKey]
      }
    }
  }
}

export function useCoupled (parentType) {
  const bridgeKey = `__${parentType}Bridge`
  function asParent (defineParent) {
    return {
      uiTypes: [parentType],
      computed: {
        [bridgeKey] () {
          return defineParent(this)
        }
      }
    }
  }

  function asChild (parentName, register) {
    let mixin = {
      uiTypes: [`${parentType}-child`],
      computed: {
        // @public
        [parentName] () {
          const parent = getTypedAncestor(this, parentType)
          return parent ? parent[bridgeKey] : null
        }
      }
    }

    if (register) {
      const cancelKey = `__${parentType}Cancel`
      mixin.created = function () {
        if (this[parentName]) {
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
