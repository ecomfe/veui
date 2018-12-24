<template>
<div
  :class="{
    'veui-button-group': true,
    'veui-button-group-disabled': disabled
  }"
  :ui="realUi"
  role="group"
  :aria-disabled="disabled"
>
  <slot>
    <veui-button
      v-for="(item, index) in items"
      :key="index"
      :disabled="disabled || item.disabled"
      :aria-posinset="index + 1"
      :aria-setsize="items.length"
      @click="handleClick(item, index)"
    >
      <slot
        v-bind="item"
        :index="index"
      >
        {{ item.label }}
      </slot>
    </veui-button>
  </slot>
</div>
</template>

<script>
import Button from './Button'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import { focusIn } from '../utils/dom'

export default {
  name: 'veui-button-group',
  components: {
    'veui-button': Button
  },
  mixins: [ui, focusable],
  props: {
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
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
