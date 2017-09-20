<template>
<div class="veui-option"
  :ui="ui"
  :class="{
    'veui-option-disabled': disabled,
    'veui-option-selected': selected
  }"
  @click.stop="select">
  <span class="veui-option-label"><slot>{{ label }}</slot></span>
  <icon class="veui-option-checkmark" v-if="selected" :name="icons.checked"></icon>
</div>
</template>

<script>
import Icon from '../Icon'
import { icons } from '../../mixins'

export default {
  name: 'veui-option',
  mixins: [icons],
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
    ui: String
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
