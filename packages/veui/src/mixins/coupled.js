import { uniqueId, findIndex, camelCase } from 'lodash'
import { getTypedAncestor } from '../utils/helper'
import { getIndexOfType } from '../utils/context'
import { walk } from '../utils/datasource'

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
        return findIndex(
          this.coupled_children__,
          (child) => child.childId === id
        )
      },
      getSortedItems () {
        const columns = this.coupled_children__
        // 因为 slot 重新渲染会更新 $slot.default, 但是可能还没有导致子组件重新，所以子组件 vm.$vnode 还是引用老的vnode
        // 此时会找到 -1, 那么可以直接跳过本次，后续的 updated 再来排序
        if (columns[0] && getIndexOfType(columns[0], this) === -1) {
          return this.coupled_children__
        }

        let sorted = []
        // 深度优先遍历，按找到 Column 的顺序直接 push 到 sorted 数组中去即可
        walk(this.$slots.default, createVnodeWalker(sorted, columns))
        this._prevSorted = sorted
        return sorted
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
    prevSorted !== newSorted &&
    (prevSorted.length !== newSorted.length ||
      newSorted.some(
        ({ childId }, index) => childId !== prevSorted[index].childId
      ))
  )
}

function createVnodeWalker (sorted, columns) {
  const callback = (vnode) => {
    const { tag, componentInstance } = vnode
    if (tag) {
      if (columns.indexOf(componentInstance) >= 0) {
        sorted.push(componentInstance)
      } else if (componentInstance) {
        // 只能用 _vnode 了，且必须用数组包起来，因为 _vnode 可能还是组件，而没有 children，不能直接 walk
        // 穿透非 Column 的组件去继续找
        walk([componentInstance._vnode], callback)
      } else {
        // keep walking children
        return true
      }
    }
    // skip children
    return false
  }

  return callback
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
