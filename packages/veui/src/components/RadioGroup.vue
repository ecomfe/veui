<template>
<div
  class="veui-radio-group"
  :ui="ui"
  role="radiogroup"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)">
  <veui-radio
    :ui="ui"
    :name="localName"
    v-for="(item, index) in items"
    :key="index"
    :value="item.value"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="item.value === value"
    @change="checked => handleChange(item.value, checked)"
    :aria-posinset="index + 1"
    :aria-setsize="items.length">
    <slot v-bind="item">{{ item.label }}</slot>
  </veui-radio>
</div>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import Radio from './Radio'
import { uniqueId } from 'lodash'

export default {
  name: 'veui-radio-group',
  components: {
    'veui-radio': Radio
  },
  mixins: [ui, input],
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
    handleChange (value, checked) {
      if (checked) {
        this.$emit('change', value)
      }
    }
  }
}
</script>
