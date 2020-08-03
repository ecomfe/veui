<template>
<div
  :class="$c('checkbox-group')"
  :ui="realUi"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
>
  <veui-checkbox
    v-for="(item, index) in items"
    :key="index"
    :name="localName"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="realValue.indexOf(item.value) !== -1"
    role="option"
    :aria-selected="realValue.indexOf(item.value) !== -1"
    :aria-posinset="index + 1"
    :aria-setsize="items.length"
    @change="checked => handleChange(item.value, checked)"
  >
    <slot
      name="item"
      v-bind="item"
      :index="index"
    >
      {{ item.label }}
    </slot>
  </veui-checkbox>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { focusIn } from '../utils/dom'
import { uniqueId, findIndex } from 'lodash'
import Checkbox from './Checkbox'
import useControllable from '../mixins/controllable'

export default {
  name: 'veui-checkbox-group',
  components: {
    'veui-checkbox': Checkbox
  },
  mixins: [prefix, ui, input, useControllable({
    prop: 'value',
    event: 'change',
    get (val) {
      return val || []
    }
  })],
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
  computed: {
    localName () {
      return this.realName || uniqueId('veui-checkbox-group-')
    }
  },
  methods: {
    handleChange (value, checked) {
      let val = [...this.realValue]
      if (checked) {
        val.push(value)
      } else {
        val.splice(
          findIndex(this.realValue, item => item === value),
          1
        )
      }
      this.commit('value', val)
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
