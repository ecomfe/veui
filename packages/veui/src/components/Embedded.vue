<script>
import Dialog from './Dialog'

export default {
  name: 'veui-embedded',
  inheritAttrs: false,
  render (h) {
    let data = {
      attrs: {
        // attrs 都直接透传到 Dialog 去
        ...this.$attrs,
        overlayClass: {
          'veui-embedded': true
        },
        inline: true
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
