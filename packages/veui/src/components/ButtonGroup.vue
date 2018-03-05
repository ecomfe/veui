<template>
<div
  :class="{
    'veui-button-group': true,
    'veui-button-group-disabled': disabled
  }"
  :ui="ui"
  role="group"
  :aria-disabled="disabled">
  <slot>
    <veui-button
      v-for="(item, index) in items"
      :key="index"
      :ui="ui"
      :disabled="disabled || item.disabled"
      @click="handleClick(item, index)"
      :aria-posinset="index + 1"
      :aria-setsize="items.length">
      <slot v-bind="item" :index="index">{{ item.label }}</slot>
    </veui-button>
  </slot>
</div>
</template>

<script>
import Button from './Button'

export default {
  name: 'veui-button-group',
  components: {
    'veui-button': Button
  },
  props: {
    ui: String,
    items: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: Boolean
  },
  methods: {
    handleClick (item, index) {
      if (item.value) {
        this.$emit(item.value, item, index)
      }
      this.$emit('click', item, index)
    }
  }
}
</script>
