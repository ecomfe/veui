<template>
<div
  :class="$c('radio-group')"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
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
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { focusIn } from '../utils/dom'
import Radio from './Radio'
import { uniqueId } from 'lodash'

export default {
  name: 'veui-radio-group',
  components: {
    'veui-radio': Radio
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
