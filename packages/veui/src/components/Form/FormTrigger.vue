<script>
import { getTypedAncestor, cloneVnode } from '../../utils/helper'
import { prefixify } from '../../mixins/prefix'

export default {
  name: 'veui-form-trigger',
  render () {
    let validatable = getTypedAncestor(this, 'form-validatable')
    let newData = {}
    if (validatable) {
      let listeners = validatable.interactiveListeners
      newData = {
        listeners,
        ...(validatable.isInvalid
          ? { class: prefixify('validator-error') }
          : {})
      }
      let vnode = this.$slots.default
      if (vnode) {
        vnode = Array.isArray(vnode) ? vnode[0] : vnode
        return cloneVnode(vnode, newData)
      } else {
        newData.isInvalid = validatable.isInvalid
      }
    }

    return this.$scopedSlots.default
      ? this.$scopedSlots.default(newData)
      : undefined
  }
}
</script>
