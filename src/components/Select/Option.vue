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
    Icon
  },
  props: {
    label: [String, Number],
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
      if (!this.disabled) {
        this.$emit('select', this.value)
      }
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";
.veui-option {
  cursor: pointer;
  height: 36px;
  line-height: 1;
  padding: 11px 10px;
  position: relative;
  color: @veui-text-color-normal;

  &:hover {
    background-color: @veui-theme-color-sup-4;
  }

  &-selected {
    color: @veui-theme-color-primary;
  }

  &-disabled {
    background-color: #fff;
    color: @veui-text-color-weak;
    cursor: not-allowed;
  }

  &-label {
    margin-right: 10px;
  }

  .veui-icon {
    float: right;
  }
}
</style>
