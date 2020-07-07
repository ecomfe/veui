<script>
import Tooltip from './Tooltip'
import { getNodes } from '../utils/context'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import { compact } from 'lodash'

export default {
  name: 'veui-popover',
  mixins: [prefix, ui, overlay],
  inheritAttrs: false,
  computed: {
    targetNode () {
      return getNodes(this.$attrs.target, this.$vnode.context)[0]
    }
  },
  render (h) {
    let data = {
      attrs: {
        ui: compact([this.uiParts.self, this.ui]).join(' '),
        ...this.$attrs,
        overlayClass: this.mergeOverlayClass({
          [this.$c('popover-box')]: true
        }),
        target: this.targetNode,
        interactive: true // Popovers are always interactive
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
