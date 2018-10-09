<template>
<div
  class="veui-checkbox-group"
  :ui="realUi"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)">
  <veui-checkbox
    :name="localName"
    v-for="(item, index) in items"
    :key="index"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="localValue.indexOf(item.value) !== -1"
    @change="checked => handleChange(item.value, checked)"
    role="option"
    :aria-selected="String(localValue.indexOf(item.value) !== -1)"
    :aria-posinset="index + 1"
    :aria-setsize="items.length">
    <slot v-bind="item" :index="index">{{ item.label }}</slot>
  </veui-checkbox>
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
    'veui-checkbox': Checkbox
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
  computed: {
    localName () {
      return this.realName || uniqueId('veui-checkbox-group-')
    }
  },
  methods: {
    handleChange (value, checked) {
      if (checked) {
        this.localValue.push(value)
      } else {
        this.localValue.splice(findIndex(this.localValue, item => item === value), 1)
      }
      this.$emit('change', this.localValue)
    }
  }
}
</script>
