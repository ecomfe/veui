<template>
<div
  class="veui-radio-group"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)"
>
  <veui-radio
    v-for="(item, index) in items"
    :key="index"
    :name="localName"
    :value="item.value"
    :model="value"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="item.value === value"
    :aria-posinset="index + 1"
    :aria-setsize="items.length"
    @change="checked => handleChange(checked, item.value)"
  >
    <slot
      v-bind="item"
      :index="index"
    >
      {{ item.label }}
    </slot>
  </veui-radio>
</div>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import focusable from '../mixins/focusable'
import { focusIn } from '../utils/dom'
import Radio from './Radio'
import { uniqueId } from 'lodash'

export default {
  name: 'veui-radio-group',
  components: {
    'veui-radio': Radio
  },
  mixins: [ui, input, focusable],
  model: {
    event: 'change'
  },
  props: {
    items: Array,
    value: null
  },
  computed: {
    localName () {
      return this.realName || uniqueId('veui-radio-group-')
    }
  },
  methods: {
    handleChange (checked, value) {
      if (checked) {
        this.$emit('change', value)
      }
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
