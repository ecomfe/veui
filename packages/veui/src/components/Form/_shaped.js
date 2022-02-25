import { getTypedAncestor } from '../../utils/helper'

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
        this[cancelKey] = register(this)
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

export function cacheShape (shapeMaker) {
  return (vm) => vm.__shape || (vm.__shape = Object.freeze(shapeMaker(vm)))
}
