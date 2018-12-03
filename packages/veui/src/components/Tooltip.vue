<script>
import Overlay from './Overlay'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import outside from '../directives/outside'
import { getNodes, isValidNodesResolver } from '../utils/context'
import { isString } from 'lodash'
import warn from '../utils/warn'
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
  components: {
    'veui-overlay': Overlay
  },
  mixins: [ui, overlay],
  props: {
    position: {
      type: String,
      default: 'top'
    },
    target: {
      validator (val) {
        return isValidNodesResolver(val)
      }
    },
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
      localOpen: this.open,
      localOverlayOptions: {
        position: this.position,
        constraints: [
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      }
    }
  },
  computed: {
    localTrigger () {
      if (this.trigger === 'custom') {
        return {}
      }
      let open
      let close
      if (isString(this.trigger)) {
        let trigger = this.trigger.split('-')
        open = trigger[0]
        close = trigger[1] || trigger[0]
      }
      open = TRIGGER_MAP[open] || open
      return {
        open,
        close
      }
    },
    targetNode () {
      return getNodes(this.target, this.$vnode.context)[0]
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
      this.localOpen = this.open
    },
    position (val) {
      this.localOverlayOptions.position = val
    }
  },
  created () {
    if (this.custom) {
      warn('[veui-tooltip] `custom` is deprecated and will be removed in `1.0.0`. Use `trigger: \'custom\'` instead.')
    }
  },
  mounted () {
    this.bindHandler()
  },
  updated () {
    this.bindHandler()
  },
  beforeDestroy () {
    if (!this.custom && this.trigger !== 'custom') {
      this.targetNode && this.targetNode.removeEventListener(this.localTrigger.open, this.openHandler, false)
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
      if (!this.custom && this.trigger !== 'custom') {
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
    if (!this.custom && this.trigger !== 'custom') {
      directives.push({
        name: 'outside',
        value: this.outsideOptions,
        modifiers: {}
      })
    }
    return (
      <veui-overlay
        ref="overlay"
        target={this.targetNode}
        open={this.realOpen}
        options={this.realOverlayOptions}
        overlayClass={this.mergeOverlayClass({
          'veui-tooltip-box': true,
          'veui-tooltip-box-transparent': !this.interactive
        })}>
        <div
          class="veui-tooltip"
          ui={this.realUi}
          role="tooltip"
          {...{directives}}>
          <div class="veui-tooltip-content">
            { this.$slots.default }
          </div>
        </div>
      </veui-overlay>
    )
  }
}
</script>
