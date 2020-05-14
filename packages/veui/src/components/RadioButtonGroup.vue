<template>
<div
  :class="[$c('radio-button-group'), $c('button-group')]"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
>
  <veui-button
    v-for="(item, index) in items"
    :key="index"
    :ui="uiParts.button"
    :class="{
      [$c('button-selected')]: item.value === localValue
    }"
    :disabled="item.disabled || realDisabled || realReadonly"
    role="radio"
    :aria-selected="item.value === localValue"
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
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { focusIn } from '../utils/dom'
import Button from './Button'

export default {
  name: 'veui-radio-button-group',
  components: {
    'veui-button': Button
  },
  mixins: [prefix, ui, input],
  model: {
    event: 'change'
  },
  props: {
    items: Array,
    /* eslint-disable vue/require-prop-types */
    value: {}
    /* eslint-enable vue/require-prop-types */
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
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
