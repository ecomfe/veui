<template>
<div
  :class="[$c('check-button-group'), $c('button-group')]"
  :ui="realUi"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
>
  <veui-button
    v-for="(item, index) in items"
    :key="`b-${item.value}`"
    :ui="uiParts.button"
    :class="{
      [$c('button-selected')]: localValue.indexOf(item.value) !== -1
    }"
    :disabled="item.disabled || realDisabled || realReadonly"
    role="option"
    :aria-selected="localValue.indexOf(item.value) !== -1"
    :aria-posinset="index + 1"
    :aria-setsize="items.length"
    @click="handleChange(item.value)"
  >
    <slot
      v-bind="item"
      :index="index"
    >
      {{ item.label }}
    </slot>
    <div
      :key="`i-${item.value}`"
      :class="$c('check-button-group-checkmark')"
    />
  </veui-button>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { focusIn } from '../utils/dom'
import { includes, findIndex } from 'lodash'
import Button from './Button'

export default {
  name: 'veui-check-button-group',
  components: {
    'veui-button': Button
  },
  mixins: [prefix, ui, input],
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
      localValue: this.value || []
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
        this.localValue.splice(
          findIndex(this.localValue, item => item === val),
          1
        )
      }
      this.$emit('change', this.localValue)
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
