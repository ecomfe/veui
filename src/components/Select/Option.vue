<template>
  <div class="veui-option" :class="{
    'veui-option-disabled': disabled,
    'veui-option-selected': selected
  }"
    @click.stop="select">
    <span class="veui-option-label"><slot>{{ label }}</slot></span>
    <icon class="veui-option-checkmark" v-if="selected" name="check"></icon>
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
@import (reference) "../../styles/theme-default/dropdown.less";

.veui-option {
  &:extend(._veui-dropdown-option all);

  &-checkmark {
    float: right;
    display: none;
  }

  [ui~="checkmark"] & &-checkmark {
    display: block;
  }
}
</style>
