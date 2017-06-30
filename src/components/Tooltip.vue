<script>
import Overlay from './Overlay'
import { outside } from '../directives'
import { getNodes } from '../utils/context'
import { isString } from 'lodash'

const POS_MAP = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top'
}

const TRIGGER_MAP = {
  hover: 'mousemove'
}

export default {
  name: 'veui-tooltip',
  directives: { outside },
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
  methods: {
    openHandler () {
      this.$emit('update:open', true)
    },
    closeHandler () {
      this.$emit('update:open', false)
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
        open={this.open}
        options={this.overlay}
        overlayClass="veui-tooltip-box">
        <div class="veui-tooltip" ui={this.ui} {...{directives}}>
          <div class="veui-tooltip-content">
            { this.$slots.default }
          </div>
        </div>
      </veui-overlay>
    )
  },
  updated () {
    if (!this.custom) {
      if (this.targetNode) {
        if (!this.targetNode.__bindToolTip__) {
          this.targetNode.addEventListener(this.localTrigger.open, this.openHandler, false)
          this.targetNode.__bindToolTip__ = true
        }
      }
    }
  },
  beforeDestroy () {
    if (!this.custom) {
      this.targetNode && this.targetNode.removeEventListener(this.localTrigger.open, this.openHandler, false)
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-tooltip-box {
  @white-color: #fff;
  @black-color: #000;
  @align-width: 10px;
  @angle-size: 5px;
  @padding-width: @angle-size * 2;
  @diagonal-size: @angle-size * sqrt(2);
  @diagonal-size-small: 4px * sqrt(2);
  .wrap-triangle(@direction, @size, @color, @left, @top) {
    left: @left;
    top: @top;
    .triangle(@direction, @size, @color, side);
  }

  .veui-tooltip {
    .veui-tooltip-content {
      padding: 8px 13px;
      border-radius: 3px;
      box-shadow: 0 -2px 4px fadeOut(@black-color, 90%);
      color: @white-color;
      background-color: fadeout(@veui-gray-color-strong, 20%);
      position: relative;
      &::before {
        content: "";
        position: absolute;
        opacity: .8;
      }
    }

    &[ui~="light"] {
      .veui-tooltip-content {
        padding: 9px 12px;
        color: @veui-gray-color-normal;
        background-color: @white-color;
        border: 1px solid @veui-gray-color-sup-2;
        box-shadow: 0 0 4px fadeOut(@black-color, 80%);
        border-radius: 4px;
        &::before {
          opacity: 1;
        }
        &::after {
          content: "";
          position: absolute;
        }
      }
    }
  }
  .veui-tooltip-triangle(@direction, @left, @top) {
    .veui-tooltip {
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(@direction, @diagonal-size, @veui-gray-color-strong, @left, @top);
        }
      }
      &[ui~="light"] {
        .veui-tooltip-content {
          &::before {
            .wrap-triangle(@direction, @diagonal-size, @veui-gray-color-sup-2, @left, @top);
          }
          &::after {
            .wrap-triangle(@direction, @diagonal-size-small, @white-color, @left, @top);
          }
        }
      }
    }
  }
  .veui-tooltip-triangle-left() {
    .veui-tooltip {
      padding-left: @padding-width;
    }
    .veui-tooltip-triangle(left, 0, 50%);
  }
  .veui-tooltip-triangle-right() {
    .veui-tooltip {
      padding-right: @padding-width;
    }
    .veui-tooltip-triangle(right, 100%, 50%);
  }
  .veui-tooltip-triangle-top() {
    .veui-tooltip {
      padding-top: @padding-width;
    }
    .veui-tooltip-triangle(top, 50%, 0);
  }
  .veui-tooltip-triangle-bottom() {
    .veui-tooltip {
      padding-bottom: @padding-width;
    }
    .veui-tooltip-triangle(bottom, 50%, 100%);
  }

  &.tether-element-attached-left.tether-target-attached-right {
    .veui-tooltip-triangle-left();
  }
  &.tether-element-attached-right.tether-target-attached-left {
    .veui-tooltip-triangle-right();
  }
  &.tether-element-attached-top.tether-target-attached-bottom {
    .veui-tooltip-triangle-top();
  }
  &.tether-element-attached-bottom.tether-target-attached-top {
    .veui-tooltip-triangle-bottom();
  }
  /**三角形位置**/
  &.tether-element-attached-left.tether-target-attached-left {
    .veui-tooltip[ui] {
      // 加上ui属性，是为了增加CSS优先级
      .veui-tooltip-content {
        &::before,
        &::after {
          left: @align-width;
        }
      }
    }
  }
  &.tether-element-attached-right.tether-target-attached-right {
    .veui-tooltip[ui] {
      .veui-tooltip-content {
        &::before,
        &::after {
          left: auto;
          right: @align-width;
        }
        &::after {
          right: @align-width + 1px;
        }
      }
    }
  }
  &.tether-element-attached-top.tether-target-attached-top {
    .veui-tooltip[ui] {
      .veui-tooltip-content {
        &::before,
        &::after {
          top: @align-width;
        }
      }
    }
  }
  &.tether-element-attached-bottom.tether-target-attached-bottom {
    .veui-tooltip[ui] {
      .veui-tooltip-content {
        &::before,
        &::after {
          top: auto;
          bottom: @align-width;
        }
        &::after {
          bottom: @align-width + 1px;
        }
      }
    }
  }
}
</style>
