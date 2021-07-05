<script>
import Dialog from './Dialog'
import prefix from '../mixins/prefix'
import { mergeClasses } from '../utils/helper'

const PLACEMENT = ['top', 'right', 'bottom', 'left']

export default {
  name: 'veui-drawer',
  mixins: [prefix],
  inheritAttrs: false,
  props: {
    placement: {
      type: String,
      default: 'right',
      validator (value) {
        return PLACEMENT.indexOf(value) >= 0
      }
    },
    // eslint-disable-next-line vue/require-prop-types
    overlayClass: {}
  },
  render (h) {
    let data = {
      attrs: {
        // attrs 都直接透传到 Dialog 去
        ...this.$attrs,
        overlayClass: mergeClasses(
          {
            [this.$c(`drawer-${this.placement}`)]: true,
            [this.$c('drawer-box')]: true
          },
          this.overlayClass
        ),
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
