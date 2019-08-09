<script>
import Tooltip from './Tooltip'
import { getNodes } from '../utils/context'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'

export default {
  name: 'veui-popover',
  mixins: [ui, overlay],
  inheritAttrs: false,
  computed: {
    targetNode () {
      return getNodes(this.$attrs.target, this.$vnode.context)[0]
    }
  },
  render (h) {
    let data = {
      attrs: {
        ui: this.uiParts.style || '',
        ...this.$attrs,
        overlayClass: this.mergeOverlayClass({
          'veui-popover-box': true
        }),
        target: this.targetNode
      },
      on: { ...this.$listeners }
    }
    return h(
      Tooltip,
      data,
      Object.keys(this.$slots).map(slot =>
        h('template', { slot }, this.$slots[slot])
      )
    )
  }
}
</script>
