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
        __coupled_children__: []
      }
    },
    computed: {
      [childrenKey] () {
        return this.$data.__coupled_children__.map(({ coupledProxy }) => ({
          ...coupledProxy
        }))
      }
    },
    methods: {
      addChild (index, child) {
        let length = this.$data.__coupled_children__.length
        if (index >= length) {
          this.$data.__coupled_children__.push(child)
        } else {
          this.$data.__coupled_children__.splice(index, 0, child)
        }
      },
      removeChildById (id) {
        let index = this.findChildIndexById(id)
        this.removeChildByIndex(index)
        return index
      },
      removeChildByIndex (index) {
        if (typeof this[onBeforeRemoveChild] === 'function') {
          this[onBeforeRemoveChild](index)
        }
        this.$data.__coupled_children__.splice(index, 1)
      },
      findChildById (id) {
        return this.$data.__coupled_children__[this.findChildIndexById(id)]
      },
      findChildIndexById (id) {
        return findIndex(
          this.$data.__coupled_children__,
          child => child.childId === id
        )
      }
    },
    beforeDestroy () {
      this.__coupled_destroying__ = true
    }
  }
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

      let index = getIndexOfType(this, parentType)

      parent.addChild(index, this)
    },
    destroyed () {
      let parent = this[parentKey]
      if (!parent || parent.__coupled_destroying__) {
        return
      }

      let index = parent.findChildIndexById(this.childId)

      parent.removeChildByIndex(index)
    }
  }
}
