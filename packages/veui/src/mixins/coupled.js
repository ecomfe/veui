import { uniqueId, findIndex, camelCase } from 'lodash'
import { getTypedAncestor } from '../utils/helper'
import { getIndexOfType } from '../utils/context'
import { walk } from '../utils/datasource'

export function useParent (
  type,
  childrenType,
  { childrenKey = 'items', onBeforeRemoveChild } = {}
) {
  return {
    uiTypes: [type],
    data () {
      return {
        coupled_children__: []
      }
    },
    computed: {
      [childrenKey] () {
        return this.coupled_children__.map(({ coupledProxy }) => ({
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
          return columns
        }

        let sorted = []
        // 深度优先遍历，按找到 Column 的顺序直接 push 到 sorted 数组中去即可
        walk(this.$slots.default, createVnodeWalker(sorted, childrenType))
        return sorted
      }
    },
    updated () {
      const prevSorted = this.coupled_children__
      const newSorted = this.getSortedItems()
      // 判断是否存在顺序不一致，没有则不要设置，否则死循环
      if (isDiff(prevSorted, newSorted)) {
        this.coupled_children__ = newSorted
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

function createVnodeWalker (sorted, childrenType) {
  const callback = (vnode, { skip }) => {
    const { tag, componentInstance: vm } = vnode
    if (vm) {
      const { uiTypes } = vm.$options
      if (uiTypes && uiTypes.indexOf(childrenType) >= 0) {
        sorted.push(vm)
      } else {
        // 只能用 _vnode 了，且必须用数组包起来，因为 _vnode 可能还是组件，而没有 children，不能直接 walk
        // 穿透非 Column 的组件去继续找
        walk([vm._vnode], callback)
      }
      // skip children
      skip()
    } else {
      skip(!tag)
    }
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
    data () {
      return {
        slotReactiveHelpers__: fields.reduce((slots, field) => {
          if (Array.isArray(field) && field.length === 3) {
            // eslint-disable-next-line no-unused-vars
            let [_, mapper, slotName] = field
            if (typeof mapper === 'function') {
              slots[slotName] = true
            }
          }
          return slots
        }, {})
      }
    },
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
            } else if (Array.isArray(field) && field.length >= 2) {
              let [key, mapper, slotName] = field
              if (typeof mapper === 'string') {
                proxy[key] = this[mapper]
              } else if (typeof mapper === 'function') {
                const fn = mapper(this)
                proxy[key] = slotName
                  ? (...args) => {
                    // 通过访问响应式变量，让所有依赖的slots的地方得到通知
                    // eslint-disable-next-line no-void, space-unary-ops
                    void this.slotReactiveHelpers__[slotName]
                    return fn(...args)
                  }
                  : fn
              } else {
                throw new Error(
                  '[veui-coupled-child] `fields` mapper must either be a string or a function'
                )
              }
            } else {
              throw new Error(
                '[veui-coupled-child] `fields` item must either be a string, or a tuple of length 2 or 3.'
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
    updated () {
      const prevSlots = this._prevScoped || {}
      Object.keys(this.slotReactiveHelpers__).forEach((slotName) => {
        if (prevSlots[slotName] !== this.$scopedSlots[slotName]) {
          this.triggerSlotChange(slotName)
        }
      })
      this._prevScoped = { ...this.$scopedSlots }
    },
    methods: {
      triggerSlotChange (slotName) {
        // toggle 变量，触发更新
        this.slotReactiveHelpers__[slotName] =
          !this.slotReactiveHelpers__[slotName]
      }
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
