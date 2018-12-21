<template>
<div
  class="veui-radio-button-group veui-button-group"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)"
>
  <veui-button
    v-for="(item, index) in items"
    :key="index"
    :class="{
      'veui-button-selected': item.value === localValue
    }"
    :disabled="item.disabled || realDisabled || realReadonly"
    role="radio"
    :aria-selected="String(item.value === localValue)"
    @click="handleChange(item.value)"
  >
    <slot
      v-bind="item"
      :index="index"
    >
      {{ item.label }}
    </slot>
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
  mixins: [ui, input],
  model: {
    event: 'change'
  },
  props: {
    items: Array,
    value: null
  },
  data () {
    return {
      localValue: this.value
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    }
  },
  methods: {
    handleChange (val) {
      this.localValue = val

      if (this.value !== val) {
        this.$emit('change', val)
      }
    }
  }
}
</script>
