<template>
<div class="veui-check-button-group veui-button-group"
  :ui="ui"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)">
  <veui-button
    :class="{
      'veui-button-selected': localValue.indexOf(item.value) !== -1
    }"
    :ui="inheritedUi"
    v-for="(item, index) in items"
    :key="index"
    :disabled="item.disabled || realDisabled || realReadonly"
    @click="handleChange(item.value)"
    role="option"
    :aria-selected="String(localValue.indexOf(item.value) !== -1)"
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
  mixins: [ui, input],
  model: {
    event: 'change'
  },
  props: {
    items: Array,
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      localValue: this.value
    }
  },
  watch: {
    value (val) {
      this.localValue = val || []
    }
  },
  methods: {
    handleChange (val) {
      if (!includes(this.localValue, val)) {
        this.localValue.push(val)
      } else {
        this.localValue.splice(findIndex(this.localValue, item => item === val), 1)
      }
      this.$emit('change', this.localValue)
    }
  }
}
</script>
