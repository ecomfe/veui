<template>
  <div class="veui-dropdown" :ui="ui">
    <veui-button
      :ui="ui"
      :class="{'veui-button-chevron': icon === 'chevron'}"
      :disabled="disabled"
      @click.stop="expanded = !expanded"
      v-clickoutside="clickoutside"
      slot="target"
      ref="veui-dropdown-button">
      <slot name="dropdown-button" :label="label">
        <icon :name="`${icon}-${expanded ? 'up' : 'down'}`"></icon>
        <span>{{ label }}</span>
      </slot>
    </veui-button>
    <veui-overlay
      target="veui-dropdown-button"
      :open="expanded"
      :options="overlay">
      <div class="veui-dropdown-options">
        <div v-for="(option, index) in options"
          :key="index"
          class="veui-dropdown-option"
          :class="{
            'veui-dropdown-option-disabled': option.disabled
          }"
          @click.stop="clickHandler(index)">
          <slot name="dropdown-option"
            v-bind="option"
            :index="index">
            <span>{{ option.label }}</span>
          </slot>
        </div>
      </div>
    </veui-overlay>
  </div>
</template>

<script>
import Icon from './Icon'
import Button from './Button'
import Overlay from './Overlay'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/caret-up'
import 'vue-awesome/icons/chevron-down'
import 'vue-awesome/icons/chevron-up'

export default {
  name: 'veui-dropdown',
  components: {
    'icon': Icon,
    'veui-button': Button,
    'veui-overlay': Overlay
  },
  props: {
    ui: String,
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'caret'
    },
    options: Array
  },
  data () {
    return {
      expanded: false,
      overlay: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
        offset: '-3px 0'
      }
    }
  },
  methods: {
    clickHandler (index) {
      this.$emit('click', index)
    },
    clickoutside () {
      if (this.expanded) {
        this.expanded = !this.expanded
      }
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
.veui-dropdown {
  .veui-button {
    width: 110px;
    padding: 11px 15px;
    position: relative;
    text-align: left;
    > span {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    > svg {
      width: 13px;
      height: 13px;
      position: absolute;
      right: 15px;
      top: 11px;
      & + span {
        width: calc(100% - 14px);
      }
    }
    &.veui-button-chevron {
      > svg {
        width: 14px;
        height: 8px;
        top: 14px;
      }
    }
  }
}
.veui-dropdown-options {
  min-width: 110px;
  max-height: 280px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid @veui-gray-color-sup-2;
  border-radius: 2px;
  .veui-dropdown-option {
    cursor: pointer;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    &:hover {
      background-color: @veui-theme-color-sup-4;
    }
    &.veui-dropdown-option-selected {
      color: @veui-theme-color-primary;
      font-weight: @veui-font-weight-bold;
    }
    &.veui-dropdown-option-disabled {
      background-color: #fff;
      color: @veui-gray-color-weak;
      cursor: not-allowed;
    }
  }
}
</style>
