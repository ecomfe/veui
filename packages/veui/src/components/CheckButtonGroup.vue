<template>
<div class="veui-check-button-group veui-button-group"
  :ui="ui"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)">
  <veui-button
    :class="{
      'veui-button-selected': value.indexOf(item.value) !== -1
    }"
    :ui="buttonUI"
    v-for="(item, index) in items"
    :key="index"
    :disabled="item.disabled || realDisabled || realReadonly"
    @click="handleChange(item.value)"
    role="option"
    :aria-selected="String(value.indexOf(item.value) !== -1)"
    :aria-posinset="index + 1"
    :aria-setsize="items.length">
    <slot v-bind="item">{{ item.label }}</slot>
  </veui-button>
</div>
</template>

<script>
import input from '../mixins/input'
import ui from '../mixins/ui'
import { includes, findIndex } from 'lodash'
import Button from './Button'

export default {
  name: 'veui-check-button-group',
  components: {
    'veui-button': Button
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
    buttonUI () {
      let allowed = ['alt', 'micro', 'tiny', 'small', 'large']
      return this.uiProps.filter(ui => includes(allowed, ui)).join(' ')
    }
  },
  methods: {
    handleChange (val) {
      if (!includes(this.value, val)) {
        this.value.push(val)
      } else {
        this.value.splice(findIndex(this.value, item => item === val), 1)
      }
      this.$emit('change', this.value)
    }
  }
}
</script>
