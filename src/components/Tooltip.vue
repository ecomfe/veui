<template>
  <div>
    <div class="demo-div" ref="topLeft" @click="localOpen = !localOpen"><slot name="button"></slot></div>
    <veui-overlay
      :target="target"
      :open="localOpen"
      :options="overlay">
      <div class="veui-tooltip" :ui="localUi">
        <div class="veui-tooltip-content">
          <slot></slot>
        </div>
      </div>
    </veui-overlay>
  </div>
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
    ui: {
      type: String,
      default: 'dark'
    },
    align: {
      type: String,
      default: 'center'
    },
    position: String,
    target: String,
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
    localUi () {
      let ui = this.ui + ' ' + this.position + '-' + this.align
      ui = ui.trim()
      return ui
    },
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
      this.$emit('update:open', this.localOpen)
    }
  }
}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-tooltip {
  @angle-size: 5px;
  @white-color: #fff;
  @black-color: #000;
  @align-width: 10px;
  @angle-size: 5px * sqrt(2);
  @angle-size-small: 4px * sqrt(2);
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

  &[ui*='top-'] {
    padding-bottom: @angle-size;
    .veui-tooltip-content {
      &::before {
        .wrap-triangle(bottom, @angle-size, @veui-gray-color-strong);
      }
    }
  }
  &[ui*='left-'] {
    padding-right: @angle-size;
    .veui-tooltip-content {
      &::before {
        .wrap-triangle(right, @angle-size, @veui-gray-color-strong);
      }
    }
  }
  &[ui*='bottom-'] {
    padding-top: @angle-size;
    .veui-tooltip-content {
      &::before {
        .wrap-triangle(top, @angle-size, @veui-gray-color-strong);
      }
    }
  }
  &[ui*='right-'] {
    padding-left: @angle-size;
    .veui-tooltip-content {
      &::before {
        .wrap-triangle(left, @angle-size, @veui-gray-color-strong);
      }
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
    &[ui*='top-'] {
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(bottom, @angle-size, @veui-gray-color-sup-2);
        }
        &::after {
          .wrap-triangle(bottom, @angle-size-small, @white-color);
          left: calc(50% + 1px);
        }
      }
    }
    &[ui*='left-'] {
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(right, @angle-size, @veui-gray-color-sup-2);
        }
        &::after {
          .wrap-triangle(right, @angle-size-small, @white-color);
          top: calc(50% + 1px);
        }
      }
    }
    &[ui*='bottom-'] {
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(top, @angle-size, @veui-gray-color-sup-2);
        }
        &::after {
          .wrap-triangle(top, @angle-size-small, @white-color);
          left: calc(50% + 1px);
        }
      }
    }
    &[ui*='right-'] {
      .veui-tooltip-content {
        &::before {
          .wrap-triangle(left, @angle-size, @veui-gray-color-sup-2);
        }
        &::after {
          .wrap-triangle(left, @angle-size-small, @white-color);
          top: calc(50% + 1px);
        }
      }
    }
  }

  &[ui~='light'],
  &[ui~='dark'] {
    &[ui~='top-left'],
    &[ui~='bottom-left'] {
      .veui-tooltip-content {
        &::before,
        &::after {
          left: @align-width;
        }
      }
    }
    &[ui~='top-right'],
    &[ui~='bottom-right'] {
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
    &[ui~='left-top'],
    &[ui~='right-top'] {
      .veui-tooltip-content {
        &::before,
        &::after {
          top: @align-width;
        }
      }
    }
    &[ui~='left-bottom'],
    &[ui~='right-bottom'] {
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
.demo-div {
  width: 100px;
  height: 30px;
  background-color: #ccc;
  text-align: center;
  line-height: 30px;
  margin: 15px 0 15px 200px;
  display: inline-block;
}
</style>
