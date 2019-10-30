import { pick, uniqueId, get } from 'lodash'
import { getTypedAncestorTracker } from '../utils/helper'
import { getIndexOfType } from '../utils/context'
import '../common/uiTypes'

export default {
  uiTypes: ['menu-item'],
  data () {
    return {
      id: uniqueId('veui-menu-item-')
    }
  },
  computed: getTypedAncestorTracker('menu').computed,
  created () {
    if (!this.menu) {
      return
    }
    let index = getIndexOfType(this, 'menu-item')
    let label = this.label || this.getLabelNaive()
    this.menu.add({
      ...pick(this, ['value', 'items', 'id', 'position', 'trigger']),
      label,
      index,
      renderLabel: this.$scopedSlots.label || (() => this.$slots.label || label)
    })
  },
  destroyed () {
    if (!this.menu) {
      return
    }
    this.menu.removeById(this.id)
  },
  methods: {
    getLabelNaive () {
      return get(this, '$vnode.componentOptions.children[0].text', '')
    }
  }
}
