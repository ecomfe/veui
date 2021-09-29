<script>
import Tooltip from './Tooltip'
import Button from './Button'
import { getNodes } from '../utils/context'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import useControllable from '../mixins/controllable'
import overlay from '../mixins/overlay'
import { compact, omit } from 'lodash'

export default {
  name: 'veui-popover',
  mixins: [prefix, ui, overlay, i18n, useControllable('open')],
  inheritAttrs: false,
  props: {
    title: String,
    open: Boolean,
    footless: {
      type: Boolean,
      default: true
    },
    okLabel: String,
    cancelLabel: String
  },
  data () {
    return {
      targetNode: null
    }
  },
  watch: {
    '$attrs.target' () {
      this.updateTargetNode()
    }
  },
  mounted () {
    this.updateTargetNode()
  },
  methods: {
    updateTargetNode () {
      this.targetNode = getNodes(this.$attrs.target, this.$vnode.context)[0]
    },
    handleOk () {
      this.commit('open', false)
      this.$emit('ok')
    },
    handleCancel () {
      this.commit('open', false)
      this.$emit('cancel')
    }
  },
  render (h) {
    return (
      <Tooltip
        ui={compact([this.uiParts.self, this.ui]).join(' ')}
        overlayClass={this.mergeOverlayClass({
          [this.$c('popover-box')]: true
        })}
        overlayStyle={this.overlayStyle}
        open={this.realOpen}
        interactive={true} // Popovers are always interactive
        {...{
          on: { ...omit(this.$listeners, ['ok', 'cancel']) },
          attrs: { ...this.$attrs }
        }}
        target={this.targetNode}
      >
        {(this.$slots.title || this.title) && (
          <div class={this.$c('popover-head')}>
            {this.$slots.title || this.title}
          </div>
        )}
        <div class={this.$c('popover-content')}>{this.$slots.default}</div>
        {!this.footless && (
          <div class={this.$c('popover-foot')}>
            {this.$slots.foot || [
              <Button ui="text aux" onClick={this.handleCancel}>
                {this.cancelLabel || this.t('cancel')}
              </Button>,
              <Button ui="text strong" onClick={this.handleOk}>
                {this.okLabel || this.t('ok')}
              </Button>
            ]}
          </div>
        )}
      </Tooltip>
    )
  }
}
</script>
