import { uniqueId, pick, find } from 'lodash'
import { getTypedAncestorTracker } from '../utils/helper'
import { getIndexOfType } from '../utils/context'
import '../common/uiTypes'

export function makeCoupledChild ({ direct = false, type, parentType, fields }) {
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
      if (!this[parentRef]) {
        return
      }
      let index = getIndexOfType(this, parentType)
      this[parentRef].add(index, {
        id: this.id,
        ...pick(this, fields)
      })
    },
    destroyed () {
      if (!this[parentRef]) {
        return
      }
      this[parentRef].removeById(this.id)
    }
  }
}

export function makeCoupledParent ({ type, childrenKey = 'items' }) {
  return {
    uiTypes: [type],
    methods: {
      add (index, child) {
        let length = this[childrenKey].length
        if (index >= length) {
          this[childrenKey].push(child)
        } else {
          this[childrenKey].splice(index, 0, child)
        }
      },
      removeById (id) {
        this[childrenKey].splice(
          this[childrenKey].map(child => child.id).indexOf(id),
          1
        )
      },
      findById (id) {
        return find(this[childrenKey], child => child.id === id)
      }
    }
  }
}
