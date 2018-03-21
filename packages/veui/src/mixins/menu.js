import { pick, uniqueId } from 'lodash'
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
  created () {
    if (!this.menu) {
      return
    }
    let index = getIndexOfType(this, 'menu-item')
    this.menu.add({
      ...pick(this, 'value', 'label', 'items', 'id'),
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
