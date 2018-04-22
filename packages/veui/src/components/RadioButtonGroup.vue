<template>
<div
  class="veui-radio-button-group veui-button-group"
  :ui="ui"
  role="radiogroup"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)">
  <veui-button
    :class="{
      'veui-button-selected': item.value === value
    }"
    :ui="inheritedUi"
    v-for="(item, index) in items"
    :key="index"
    :disabled="item.disabled || realDisabled || realReadonly"
    @click="handleChange(item.value)"
    role="radio"
    :aria-selected="String(item.value === value)">
    <slot v-bind="item">{{ item.label }}</slot>
  </veui-button>
</div>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import Button from './Button'

export default {
  name: 'veui-radio-button-group',
  components: {
    'veui-button': Button
  },
  mixins: [input, ui],
  model: {
    event: 'change'
  },
  props: {
    items: Array,
    value: null
  },
  methods: {
    handleChange (val) {
      if (this.value !== val) {
        this.$emit('change', val)
      }
    }
  }
}
</script>
