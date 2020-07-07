import { uniqueId, pick, findIndex } from 'lodash'
import { getTypedAncestorTracker } from '../utils/helper'
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

      let index = parent.removeChildById(this.id)

      if (typeof parent.handleRemoveChild === 'function') {
        parent.handleRemoveChild(index)
      }
    }
  }
}

export function useCoupledParent ({ type, childrenKey = 'items' }) {
  return {
    uiTypes: [type],
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
        let index = this[childrenKey].map(child => child.id).indexOf(id)
        this[childrenKey].splice(index, 1)
        return index
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

function mapState (state, map) {
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
