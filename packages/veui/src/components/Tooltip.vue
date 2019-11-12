<script>
import Overlay from './Overlay'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import outside from '../directives/outside'
import { getNodes, isValidNodesResolver } from '../utils/context'
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
  components: {
    'veui-overlay': Overlay
  },
  mixins: [prefix, ui, overlay],
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
        position: this.position
      }
    }
  },
  computed: {
    realTrigger () {
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
      return this.getTargetNode(this.target)
    },
    outsideOptions () {
      return {
        handler: this.closeHandler,
        refs: [this.targetNode],
        trigger: this.realTrigger.close,
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
    targetNode (val, oldVal) {
      this.removeHandler(oldVal)
      this.bindHandler()
    },
    trigger () {
      this.rebindHandler()
    },
    position (val) {
      this.localOverlayOptions.position = val
    }
  },
  mounted () {
    this.bindHandler()
  },
  beforeDestroy () {
    this.removeHandler()
  },
  methods: {
    getTargetNode (target) {
      return getNodes(this.target, this.$vnode.context)[0]
    },
    openHandler () {
      this.localOpen = true
    },
    closeHandler () {
      this.localOpen = false
    },
    removeHandler (target) {
      let targetNode = target || this.targetNode
      if (!targetNode || !targetNode.__tooltip_open_trigger__) {
        return
      }

      targetNode.removeEventListener(
        targetNode.__tooltip_open_trigger__,
        this.openHandler,
        false
      )
      targetNode.__tooltip_open_trigger__ = null
    },
    bindHandler () {
      if (this.trigger === 'custom' || !this.targetNode) {
        return
      }
      if (!this.targetNode.__tooltip_open_trigger__) {
        this.targetNode.addEventListener(
          this.realTrigger.open,
          this.openHandler,
          false
        )
        this.targetNode.__tooltip_open_trigger__ = this.realTrigger.open
      }
    },
    rebindHandler () {
      this.removeHandler()
      this.bindHandler()
    }
  },
  render () {
    let directives = []
    if (this.trigger !== 'custom') {
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
          [this.$c('tooltip-box')]: true,
          [this.$c('tooltip-box-transparent')]: !this.interactive
        })}
      >
        <div
          class={this.$c('tooltip')}
          ui={this.realUi}
          role="tooltip"
          {...{ directives }}
        >
          <div class={this.$c('tooltip-content')}>{this.$slots.default}</div>
          <div class={this.$c('tooltip-arrow')} />
        </div>
      </veui-overlay>
    )
  }
}
</script>
