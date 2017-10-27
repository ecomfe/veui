<script>
import Overlay from './Overlay'
import { outside } from '../directives'
import { overlay } from '../mixins'
import { getNodes } from '../utils/context'
import { resolveOverlayPosition } from '../utils/helper'
import { isString } from 'lodash'
import config from '../managers/config'

const TRIGGER_MAP = {
  hover: 'mouseenter'
}

config.defaults({
  'tooltip.hideDelay': 300
})

export default {
  name: 'veui-tooltip',
  directives: { outside },
  mixins: [overlay],
  components: {
    'veui-overlay': Overlay
  },
  props: {
    ui: String,
    position: {
      type: String,
      default: 'top'
    },
    target: String,
    trigger: {
      type: String,
      default: 'hover'
    },
    hideDelay: {
      type: Number,
      default: config.get('tooltip.hideDelay')
    },
    custom: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: false
    },
    interactive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      localOpen: this.open
    }
  },
  computed: {
    localTrigger () {
      let open
      let close
      if (isString(this.trigger)) {
        let trigger = this.trigger.split('-')
        open = trigger[0]
        close = trigger[1] || trigger[0]
      }
      open = TRIGGER_MAP[open] || open
      return {open, close}
    },
    targetNode () {
      return getNodes(this.target, this.$vnode.context)[0]
    },
    overlay () {
      return {
        ...resolveOverlayPosition(this.position),
        constraints: [
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      }
    },
    outsideOptions () {
      return {
        handler: this.closeHandler,
        refs: this.targetNode,
        trigger: this.localTrigger.close,
        delay: this.hideDelay,
        excludeSelf: !this.interactive
      }
    },
    realOpen () {
      return this.localOpen && !!this.targetNode
    }
  },
  watch: {
    open (val) {
      if (this.localOpen !== val) {
        this.localOpen = val
      }
    },
    localOpen (val) {
      if (this.open !== val) {
        this.$emit('update:open', val)
      }
    },
    target () {
      this.localOpen = true
    }
  },
  methods: {
    openHandler () {
      this.localOpen = true
    },
    closeHandler () {
      this.localOpen = false
    },
    bindHandler () {
      if (!this.custom) {
        if (this.targetNode) {
          if (!this.targetNode.__bindToolTip__) {
            this.targetNode.addEventListener(this.localTrigger.open, this.openHandler, false)
            this.targetNode.__bindToolTip__ = true
          }
        }
      }
    }
  },
  render () {
    let directives = []
    if (!this.custom) {
      directives.push({
        name: 'outside',
        value: this.outsideOptions,
        modifiers: {}
      })
    }
    return (
      <veui-overlay
        target={this.targetNode}
        open={this.realOpen}
        options={this.overlay}
        overlayClass={this.mergeOverlayClass({
          'veui-tooltip-box': true,
          'veui-tooltip-box-transparent': !this.interactive
        })}>
        <div class="veui-tooltip" ui={this.ui} {...{directives}}>
          <div class="veui-tooltip-content">
            { this.$slots.default }
          </div>
        </div>
      </veui-overlay>
    )
  },
  mounted () {
    this.bindHandler()
  },
  updated () {
    this.bindHandler()
  },
  beforeDestroy () {
    if (!this.custom) {
      this.targetNode && this.targetNode.removeEventListener(this.localTrigger.open, this.openHandler, false)
    }
  }
}
</script>
