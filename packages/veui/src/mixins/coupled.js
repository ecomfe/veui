import { uniqueId, pick, findIndex, camelCase } from 'lodash'
import { getTypedAncestorTracker, getTypedAncestor } from '../utils/helper'
import { getIndexOfType } from '../utils/context'
import '../common/uiTypes'

export function useCoupledChild ({
  direct = false,
  type,
  parentType,
  fields,
  watchKeys = []
}) {
  let computed = getTypedAncestorTracker(parentType, direct).computed
  let parentRef = Object.keys(computed)[0]
  return {
    uiTypes: [type],
    data () {
      return {
        id: uniqueId(`veui-${type}-`)
      }
    },
    computed,
    created () {
      let parent = this[parentRef]
      if (!parent) {
        return
      }
      let index = getIndexOfType(this, parentType)
      parent.addChild(index, {
        id: this.id,
        index,
        ...mapState(this, fields)
      })

      if (watchKeys.length > 0) {
        this.$watch(
          () => watchKeys.map(key => this[key]),
          () => {
            parent.updateChild({
              id: this.id,
              ...mapState(this, fields)
            })
          }
        )
      }
    },
    destroyed () {
      let parent = this[parentRef]
      if (!parent || parent.__destroying__) {
        return
      }

      let index = parent.findChildIndexById(this.id)

      if (typeof parent.handleRemoveChild === 'function') {
        parent.handleRemoveChild(index)
      }

      parent.removeChildByIndex(index)
    }
  }
}

export function useCoupledParent ({ type, childrenKey = 'items' }) {
  return {
    uiTypes: [type],
    data () {
      return {
        [childrenKey]: []
      }
    },
    methods: {
      addChild (index, child) {
        let length = this[childrenKey].length
        if (index >= length) {
          this[childrenKey].push(child)
        } else {
          this[childrenKey].splice(index, 0, child)
        }
      },
      updateChild (child) {
        let index = this.findChildIndexById(child.id)
        this.$set(this[childrenKey], index, {
          index,
          ...child
        })
      },
      removeChildById (id) {
        let index = this.findChildIndexById(id)
        this.removeChildByIndex(index)
        return index
      },
      removeChildByIndex (index) {
        this[childrenKey].splice(index, 1)
      },
      findChildById (id) {
        return this[childrenKey][this.findChildIndexById(id)]
      },
      findChildIndexById (id) {
        return findIndex(this[childrenKey], child => child.id === id)
      }
    },
    beforeDestroy () {
      this.__destroying__ = true
    }
  }
}

export function mapState (state, map) {
  if (Array.isArray(map)) {
    return pick(state, map)
  } else if (typeof map === 'object') {
    return Object.keys(map).reduce((result, field) => {
      let mapper = map[field]

      if (typeof mapper === 'string') {
        result[mapper] = state[field]
      } else if (typeof mapper === 'function') {
        result[field] = mapper(state)
      }

      return result
    }, {})
  }

  throw new Error('[coupled] mixin received an invalid argument.')
}

export function useParent (type, { childrenKey = 'items' } = {}) {
  return {
    uiTypes: [type],
    data () {
      return {
        coupledChildren: []
      }
    },
    computed: {
      [childrenKey] () {
        return this.coupledChildren.map(({ coupledProxy }) => ({
          ...coupledProxy
        }))
      }
    },
    methods: {
      addChild (index, child) {
        let length = this.coupledChildren.length
        if (index >= length) {
          this.coupledChildren.push(child)
        } else {
          this.coupledChildren.splice(index, 0, child)
        }
      },
      removeChildById (id) {
        let index = this.findChildIndexById(id)
        this.removeChildByIndex(index)
        return index
      },
      removeChildByIndex (index) {
        this.coupledChildren.splice(index, 1)
      },
      findChildById (id) {
        return this.coupledChildren[this.findChildIndexById(id)]
      },
      findChildIndexById (id) {
        return findIndex(
          this.coupledChildren,
          child => child.__coupled_child_id__ === id
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
            id: this.__coupled_child_id__
          }
        )
      }
    },
    created () {
      let parent = this[parentKey]

      if (!parent) {
        return
      }

      this.__coupled_child_id__ = uniqueId(`veui-${type}-`)

      let index = getIndexOfType(this, parentType)

      parent.addChild(index, this)
    },
    destroyed () {
      let parent = this[parentKey]
      if (!parent || parent.__destroying__) {
        return
      }

      let index = parent.findChildIndexById(this.__coupled_child_id__)

      if (typeof parent.handleRemoveChild === 'function') {
        parent.handleRemoveChild(index)
      }

      parent.removeChildByIndex(index)
    }
  }
}
