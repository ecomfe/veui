<script>
import Overlay from './Overlay'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import outside from '../directives/outside'
import { getNodes, isValidNodesResolver } from '../utils/context'
import { isString } from 'lodash'
import config from '../managers/config'
import useConfig from '../mixins/config'
import useControllable from '../mixins/controllable'
import '../common/global'

const TRIGGER_MAP = {
  hover: 'mouseenter'
}

config.defaults(
  {
    hideDelay: 300
  },
  'tooltip'
)

export default {
  name: 'veui-tooltip',
  directives: { outside },
  components: {
    'veui-overlay': Overlay
  },
  mixins: [
    ui,
    overlay,
    useConfig('config', 'tooltip'),
    useControllable([{ prop: 'open', event: 'toggle' }])
  ],
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
      type: Number
    },
    open: {
      type: Boolean,
      default: false
    },
    interactive: {
      type: Boolean,
      default: true
    },
    autofocus: Boolean,
    aimCenter: Boolean
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
    realHideDelay () {
      return this.hideDelay == null
        ? this.config['tooltip.hideDelay']
        : this.hideDelay
    },
    realPosition () {
      return this.position || 'top'
    },
    targetNode () {
      return this.getTargetNode()
    },
    outsideOptions () {
      return {
        handler: this.closeHandler,
        refs: [this.targetNode],
        trigger: this.realTrigger.close,
        delay: this.realHideDelay,
        excludeSelf: !this.interactive
      }
    },
    realAutofocus () {
      return this.interactive ? this.autofocus : false
    },
    defaultOverlayOptions () {
      let position = this.realPosition
      return {
        position,
        ...(this.aimCenter
          ? {
            offset: {
              offset:
                  position.indexOf('start') !== -1
                    ? '50%'
                    : position.indexOf('end') !== -1
                      ? '-50%'
                      : 0
            }
          }
          : {})
      }
    }
  },
  watch: {
    targetNode (_, oldVal) {
      this.removeHandler(oldVal)
      this.bindHandler()
    },
    trigger () {
      this.rebindHandler()
    },
    position (val) {
      this.defaultOverlayOptions.position = val
    }
  },
  mounted () {
    this.bindHandler()
  },
  beforeDestroy () {
    this.removeHandler()
  },
  methods: {
    getTargetNode () {
      return getNodes(this.target, this.$vnode.context)[0]
    },
    openHandler () {
      this.commit('open', true)
    },
    closeHandler () {
      this.commit('open', false)
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
        open={this.realOpen && !!this.targetNode}
        options={this.realOverlayOptions}
        overlayClass={this.mergeOverlayClass({
          [this.$c('tooltip-box')]: true,
          [this.$c('tooltip-box-transparent')]: !this.interactive
        })}
        overlayStyle={this.overlayStyle}
        autofocus={this.realAutofocus}
      >
        <div
          class={{
            [this.$c('tooltip')]: true,
            [this.$c('tooltip-aim-center')]: this.aimCenter
          }}
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
