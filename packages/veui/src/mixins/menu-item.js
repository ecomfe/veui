import { pick, uniqueId, get } from 'lodash'
import { getTypedAncestorTracker } from '../utils/helper'
import { getIndexOfType } from '../utils/context'

export default {
  uiTypes: ['menu-item'],
  data () {
    return {
      id: uniqueId('veui-menu-item-')
    }
  },
  computed: getTypedAncestorTracker('menu').computed,
  created () {
    // 只有 Select 是两次渲染 OptionGroup，仅仅跳过 Select 而已
    if (!this.menu || this.renderFor === 'render') {
      return
    }
    let index = getIndexOfType(this, 'menu')
    let label = this.label || this.getLabelNaive()
    this.menu.add({
      ...pick(this, [
        'value',
        'items',
        'id',
        'position',
        'trigger',
        'disabled'
      ]),
      label,
      index,
      renderLabel:
        this.$scopedSlots.label || (() => this.$slots.label || label),
      renderBefore: () =>
        this.$scopedSlots.before
          ? this.$scopedSlots.before()
          : this.$slots.before,
      renderAfter: () =>
        this.$scopedSlots.after ? this.$scopedSlots.after() : this.$slots.after
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
