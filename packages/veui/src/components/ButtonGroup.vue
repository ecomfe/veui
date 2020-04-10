<template>
<div
  :class="{
    [$c('button-group')]: true,
    [$c('button-group-disabled')]: disabled
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
      @click="handleClick(item, index, $event)"
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
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import { focusIn } from '../utils/dom'

export default {
  name: 'veui-button-group',
  components: {
    'veui-button': Button
  },
  mixins: [prefix, ui, focusable],
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
    handleClick (item, index, e) {
      if (typeof item.value === 'string') {
        this.$emit(item.value, item, index, e)
      }
      this.$emit('click', item, index, e)
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
