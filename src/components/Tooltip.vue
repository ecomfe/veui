<template>
  <veui-overlay
    :target="target"
    :open="localOpen"
    :options="overlay"
    overlayClass="veui-tooltip-box">
    <div class="veui-tooltip" :ui="ui" v-outside.hover="switchTip">
      <div class="veui-tooltip-content">
        <slot></slot>
      </div>
    </div>
  </veui-overlay>
</template>
<script>
import Overlay from './Overlay'
import { outside } from '../directives'

let posMap = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top'
}

export default {
  name: 'veui-tooltip',
  uiTypes: ['tooltip'],
  directives: { outside },
  components: {
    'veui-overlay': Overlay
  },
  props: {
    ui: String,
    align: {
      type: String,
      default: 'center'
    },
    position: String,
    target: Object,
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localOpen: false
    }
  },
  watch: {
    open (value) {
      this.localOpen = value
    }
  },
  computed: {
    overlay () {
      let attachment
      let targetAttachment
      if (this.position === 'left' || this.position === 'right') {
        attachment = this.align + ' ' + posMap[this.position]
        targetAttachment = this.align + ' ' + this.position
      } else {
        attachment = posMap[this.position] + ' ' + this.align
        targetAttachment = this.position + ' ' + this.align
      }
      return {
        attachment: attachment,
        targetAttachment: targetAttachment,
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together'
          },
          {
            to: 'window',
            attachment: 'together',
            pin: true
          }
        ]
      }
    }
  },
  methods: {
    switchTip () {
      this.localOpen = !this.localOpen
      this.$emit('update', this.localOpen)
    }
  }
}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";

@white-color: #fff;
@black-color: #000;
@align-width: 10px;
@angle-size: 5px;
@diagonal-size: @angle-size * sqrt(2);
@diagonal-size-small: 4px * sqrt(2);
.wrap-triangle(@direction, @size, @color) when (@direction = top) {
  left: 50%;
  top: 0;
  .triangle(@direction, @size, @color, side);
}
.wrap-triangle(@direction, @size, @color) when (@direction = left) {
  left: 0;
  top: 50%;
  .triangle(@direction, @size, @color, side);
}
.wrap-triangle(@direction, @size, @color) when (@direction = bottom) {
  left: 50%;
  top: 100%;
  .triangle(@direction, @size, @color, side);
}
.wrap-triangle(@direction, @size, @color) when (@direction = right) {
  left: 100%;
  top: 50%;
  .triangle(@direction, @size, @color, side);
}

.veui-tooltip {
  .veui-tooltip-content {
    padding: 11px 15px;
    .border-radius(3px);
    box-shadow: 0 -2px 4px fadeOut(@black-color, 90%);
    color: @white-color;
    .rgba-background(@veui-gray-color-strong, 80%);
    position: relative;
    &::before {
      content: '';
      position: absolute;
      opacity: .8;
    }
  }

  &[ui~='light'] {
    .veui-tooltip-content {
      padding: 11px 12px;
      color: @veui-gray-color-normal;
      .rgba-background(@white-color);
      border: 1px solid @veui-gray-color-sup-2;
      box-shadow: 0 0 4px fadeOut(@black-color, 80%);
      border-radius: 4px;
      &::before {
        opacity: 1;
      }
      &::after {
        content: '';
        position: absolute;
      }
    }
  }
}
.veui-tooltip-box {
  &.tether-element-attached-left.tether-target-attached-right {
    .veui-tooltip {
      margin-left: @angle-size;
      padding-left: @angle-size;
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(left, @diagonal-size, @veui-gray-color-strong);
        }
      }
      &[ui~='light'] {
        .veui-tooltip-content {
          &::before {
            .wrap-triangle(left, @diagonal-size, @veui-gray-color-sup-2);
          }
          &::after {
            .wrap-triangle(left, @diagonal-size-small, @white-color);
          }
        }
      }
    }
  }
  &.tether-element-attached-right.tether-target-attached-left {
    .veui-tooltip {
      margin-right: @angle-size;
      padding-right: @angle-size;
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(right, @diagonal-size, @veui-gray-color-strong);
        }
      }
      &[ui~='light'] {
        .veui-tooltip-content {
          &::before {
            .wrap-triangle(right, @diagonal-size, @veui-gray-color-sup-2);
          }
          &::after {
            .wrap-triangle(right, @diagonal-size-small, @white-color);
          }
        }
      }
    }
  }
  &.tether-element-attached-top.tether-target-attached-bottom {
    .veui-tooltip {
      margin-top: @angle-size;
      padding-top: @angle-size;
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(top, @diagonal-size, @veui-gray-color-strong);
        }
      }
      &[ui~='light'] {
        .veui-tooltip-content {
          &::before {
            .wrap-triangle(top, @diagonal-size, @veui-gray-color-sup-2);
          }
          &::after {
            .wrap-triangle(top, @diagonal-size-small, @white-color);
          }
        }
      }
    }
  }
  &.tether-element-attached-bottom.tether-target-attached-top {
    .veui-tooltip {
      margin-bottom: @angle-size;
      padding-bottom: @angle-size;
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(bottom, @diagonal-size, @veui-gray-color-strong);
        }
      }
      &[ui~='light'] {
        .veui-tooltip-content {
          &::before {
            .wrap-triangle(bottom, @diagonal-size, @veui-gray-color-sup-2);
          }
          &::after {
            .wrap-triangle(bottom, @diagonal-size-small, @white-color);
          }
        }
      }
    }
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
          right: calc(@align-width + 1px);
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
          bottom: calc(@align-width + 1px);
        }
      }
    }
  }
}
</style>
