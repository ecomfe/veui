<script>
import Dialog from './Dialog'

const PLACEMENT = ['top', 'right', 'bottom', 'left']

export default {
  name: 'veui-drawer',
  inheritAttrs: false,
  props: {
    placement: {
      type: String,
      default: 'right',
      validator (value) {
        return PLACEMENT.indexOf(value) >= 0
      }
    }
  },
  render (h) {
    let data = {
      attrs: {
        // attrs 都直接透传到 Dialog 去
        ...this.$attrs,
        overlayClass: {
          [`veui-drawer-${this.placement}`]: true,
          'veui-drawer-box-mask': true
        },
        modal: true,
        maskClosable: true,
        draggable: false
      },
      // nativeOn 直接在 drawer 上注册到 dom ，不需透传
      on: this.$listeners,
      scopedSlots: this.$scopedSlots
    }

    return h(
      Dialog,
      data,
      Object.keys(this.$slots).map(slot =>
        h('template', { slot }, this.$slots[slot])
      )
    )
  }
}
</script>
