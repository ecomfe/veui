<template>
  <div class="veui-option" :class="{
    'veui-option-disabled': disabled,
    'veui-option-selected': selected
  }"
    @click.stop="select">
    <slot>
      <span :class="{'veui-option-label': icon}">{{ label }}</span>
      <icon v-if="icon && selected" name="check"></icon>
    </slot>
  </div>
</template>

<script>
import Icon from '../Icon'
import 'vue-awesome/icons/check'

export default {
  name: 'veui-option',
  components: {
    'icon': Icon
  },
  props: {
    label: String,
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select () {
      if (this.disabled) {
        return
      }
      this.$emit('select', this.value)
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";
.veui-option {
  cursor: pointer;
  width: 100%;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  position: relative;
  &:hover {
    background-color: @veui-theme-color-sup-4;
  }
  &.veui-option-selected {
    color: @veui-theme-color-primary;
  }
  &.veui-option-disabled {
    background-color: #fff;
    color: @veui-gray-color-weak;
    cursor: not-allowed;
  }
  .veui-option-label {
    margin-right: 17px;
  }
  svg {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 10px;
    top: 12px;
  }
}
</style>
