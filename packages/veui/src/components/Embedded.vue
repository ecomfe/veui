<script>
import Dialog from './Dialog'
import prefix from '../mixins/prefix'

export default {
  name: 'veui-embedded',
  mixins: [prefix],
  inheritAttrs: false,
  render (h) {
    let data = {
      attrs: {
        // attrs 都直接透传到 Dialog 去
        ...this.$attrs,
        overlayClass: {
          [this.$c('embedded')]: true
        },
        inline: true,
        outsideClosable: false,
        draggable: false,
        escapable: false,
        modal: false
      },
      // nativeOn 直接在 embedded 上注册到 dom ，不需透传
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
