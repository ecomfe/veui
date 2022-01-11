import { uniqueId, findIndex, camelCase } from 'lodash'
import { getTypedAncestor } from '../utils/helper'
import { getIndexOfType } from '../utils/context'

export function useParent (
  type,
  { childrenKey = 'items', onBeforeRemoveChild } = {}
) {
  return {
    uiTypes: [type],
    data () {
      return {
        coupled_children__: [],
        sorted_children__: []
      }
    },
    computed: {
      [childrenKey] () {
        const sorted = this.sorted_children__.length
          ? this.sorted_children__
          : this.coupled_children__
        return sorted.map(({ coupledProxy }) => ({
          ...coupledProxy
        }))
      }
    },
    methods: {
      addChild (child) {
        this.coupled_children__.push(child)
      },
      removeChildById (id) {
        let index = this.findChildIndexById(id)
        if (typeof this[onBeforeRemoveChild] === 'function') {
          this[onBeforeRemoveChild](id)
        }
        this.removeChildByIndex(index)
        return index
      },
      removeChildByIndex (index) {
        this.coupled_children__.splice(index, 1)
      },
      findChildById (id) {
        return this.coupled_children__[this.findChildIndexById(id)]
      },
      findChildIndexById (id) {
        return findIndex(this.coupled_children__, child => child.childId === id)
      },
      getSortedItems () {
        let items = this.coupled_children__
          .slice()
          .reduce((acc, child, index) => {
            let realIndex = getIndexOfType(child, this)
            if (realIndex === -1) {
              // 因为 slot 重新渲染会更新 $slot.default, 但是可能还没有导致子组件重新，所以子组件 vm.$vnode 还是引用老的vnode
              // 此时会找到 -1, 不知道在 updated 中会不会遇到这种情况，统一处理下，保留上次的顺序吧
              const prevIndex = (this._prevSorted || []).indexOf(child)
              realIndex = prevIndex >= 0 ? prevIndex : index
            }
            acc[realIndex] = child
            return acc
          }, [])
        this._prevSorted = items
        return items
      }
    },
    updated () {
      const prevSorted = this._prevSorted || []
      const newSorted = this.getSortedItems()
      // 判断是否存在顺序不一致，没有则不要设置，否则死循环
      if (isDiff(prevSorted, newSorted)) {
        this.sorted_children__ = newSorted
      }
    },
    beforeDestroy () {
      this.__coupled_destroying__ = true
    }
  }
}

function isDiff (prevSorted, newSorted) {
  return (
    prevSorted.length !== newSorted.length ||
    newSorted.some(
      ({ childId }, index) => childId !== prevSorted[index].childId
    )
  )
}

/*
 ## fields

  [
    'columns',
    ['fixed', 'realFixed'],
    ['hasFoot', vm => () => !!(vm.$scopedSlots.foot || vm.$slots.foot)]
  }]

 */
export function useChild (type, parentType, fields, { direct = false } = {}) {
  let parentKey = camelCase(parentType)

  return {
    uiTypes: [type],
    computed: {
      [parentKey] () {
        return getTypedAncestor(this, parentType, direct)
      },
      coupledProxy () {
        if (!Array.isArray(fields)) {
          throw new Error('[veui-coupled-child] `fields` must be an array.')
        }

        return fields.reduce(
          (proxy, field) => {
            if (typeof field === 'string') {
              proxy[field] = this[field]
            } else if (Array.isArray(field) && field.length === 2) {
              let [key, mapper] = field
              if (typeof mapper === 'string') {
                proxy[key] = this[mapper]
              } else if (typeof mapper === 'function') {
                proxy[key] = mapper(this)
              } else {
                throw new Error(
                  '[veui-coupled-child] `fields` mapper must either be a string or a function'
                )
              }
            } else {
              throw new Error(
                '[veui-coupled-child] `fields` item must either be a string, or a tuple of length 2.'
              )
            }

            return proxy
          },
          {
            id: this.childId
          }
        )
      }
    },
    created () {
      let parent = this[parentKey]

      if (!parent) {
        return
      }

      this.childId = uniqueId(`veui-${type}-`)
      parent.addChild(this)
    },
    destroyed () {
      let parent = this[parentKey]
      if (!parent || parent.__coupled_destroying__) {
        return
      }

      parent.removeChildById(this.childId)
    }
  }
}
