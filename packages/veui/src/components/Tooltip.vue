<script>
import Overlay from './Overlay'
import { outside } from '../directives'
import { overlay } from '../mixins'
import { getNodes } from '../utils/context'
import { isString } from 'lodash'

const POS_MAP = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top'
}

const TRIGGER_MAP = {
  hover: 'mouseenter'
}

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
    custom: {
      type: Boolean,
      default: false
    },
    open: {
      type: Boolean,
      default: false
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
      let attachment
      let targetAttachment
      let position = this.position.split(' ')
      let placement = position[0] || 'top'
      let align = position[1] || 'center'
      if (placement === 'left' || placement === 'right') {
        attachment = `${align} ${POS_MAP[placement]}`
        targetAttachment = `${align} ${placement}`
      } else {
        attachment = `${POS_MAP[placement]} ${align}`
        targetAttachment = `${placement} ${align}`
      }
      return {
        attachment: attachment,
        targetAttachment: targetAttachment,
        constraints: [
          {
            to: 'window',
            attachment: 'together',
            pin: true
          }
        ]
      }
    },
    outsideOptions () {
      return {
        handler: this.closeHandler,
        refs: this.targetNode,
        trigger: this.localTrigger.close
      }
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
        open={this.localOpen}
        options={this.overlay}
        overlayClass={this.mergeOverlayClass('veui-tooltip-box')}>
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
