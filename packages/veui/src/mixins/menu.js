import { pick, uniqueId, get } from 'lodash'
import { getTypedAncestorTracker } from '../utils/helper'
import { getIndexOfType } from '../utils/context'
import '../config/uiTypes'

export default {
  uiTypes: ['menu-item'],
  data () {
    return {
      id: uniqueId('veui-menu-item-')
    }
  },
  computed: getTypedAncestorTracker('menu').computed,
  methods: {
    getLabelNaive () {
      return get(this, '$vnode.componentOptions.children[0].text', '')
    }
  },
  created () {
    if (!this.menu) {
      return
    }
    let index = getIndexOfType(this, 'menu-item')
    this.menu.add({
      ...pick(this, 'value', 'items', 'id'),
      label: this.label || this.getLabelNaive(),
      index
    })
  },
  destroyed () {
    if (!this.menu) {
      return
    }
    this.menu.removeById(this.id)
  }
}
