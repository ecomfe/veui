<template>
<div
  class="veui-checkbox-group"
  :ui="ui"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)">
  <checkbox
    :ui="ui"
    :name="localName"
    v-for="(item, index) in items"
    :key="index"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="value.indexOf(item.value) !== -1"
    @change="checked => handleChange(item.value, checked)"
    role="option"
    :aria-selected="String(value.indexOf(item.value) !== -1)"
    :aria-posinset="index + 1"
    :aria-setsize="items.length">
    <slot v-bind="item">{{ item.label }}</slot>
  </checkbox>
</div>
</template>

<script>
import input from '../mixins/input'
import ui from '../mixins/ui'
import { uniqueId, findIndex } from 'lodash'
import Checkbox from './Checkbox'

export default {
  name: 'veui-checkbox-group',
  components: {
    'checkbox': Checkbox
  },
  mixins: [input, ui],
  model: {
    event: 'change'
  },
  props: {
    ui: String,
    items: Array,
    value: Array
  },
  computed: {
    localName () {
      return this.realName || uniqueId('veui-checkbox-group-')
    }
  },
  methods: {
    handleChange (value, checked) {
      if (checked) {
        this.value.push(value)
      } else {
        this.value.splice(findIndex(this.value, item => item === value), 1)
      }
      this.$emit('change', this.value)
    }
  }
}
</script>
