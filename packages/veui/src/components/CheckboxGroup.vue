<template>
<div
  class="veui-checkbox-group"
  :ui="realUi"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="String(realReadonly)"
  :aria-disabled="String(realDisabled)"
>
  <veui-checkbox
    v-for="(item, index) in items"
    :key="index"
    :name="localName"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="localValue.indexOf(item.value) !== -1"
    role="option"
    :aria-selected="String(localValue.indexOf(item.value) !== -1)"
    :aria-posinset="index + 1"
    :aria-setsize="items.length"
    @change="checked => handleChange(item.value, checked)"
  >
    <slot
      v-bind="item"
      :index="index"
    >
      {{ item.label }}
    </slot>
  </veui-checkbox>
</div>
</template>

<script>
import ui from '../mixins/ui'
import input from '../mixins/input'
import focusable from '../mixins/focusable'
import { focusIn } from '../utils/dom'
import { uniqueId, findIndex } from 'lodash'
import Checkbox from './Checkbox'

export default {
  name: 'veui-checkbox-group',
  components: {
    'veui-checkbox': Checkbox
  },
  mixins: [ui, input, focusable],
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
  computed: {
    localName () {
      return this.realName || uniqueId('veui-checkbox-group-')
    }
  },
  watch: {
    value (val) {
      this.localValue = val || []
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
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
