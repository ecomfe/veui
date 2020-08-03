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
      [$c('button-selected')]: realValue.indexOf(item.value) !== -1
    }"
    :disabled="item.disabled || realDisabled || realReadonly"
    role="option"
    :aria-selected="realValue.indexOf(item.value) !== -1"
    :aria-posinset="index + 1"
    :aria-setsize="items.length"
    @click="handleChange(item.value)"
  >
    <div
      :key="`i-${item.value}`"
      :class="$c('check-button-group-checkmark')"
      aria-hidden="true"
    >
      <veui-icon :name="icons.check"/>
    </div>
    <slot
      name="item"
      v-bind="item"
      :index="index"
    >{{ item.label }}</slot>
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
import Icon from './Icon'
import useControllable from '../mixins/controllable'

export default {
  name: 'veui-check-button-group',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
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
  methods: {
    handleChange (val) {
      let value = [...this.realValue]
      if (!includes(value, val)) {
        value.push(val)
      } else {
        value.splice(
          findIndex(value, item => item === val),
          1
        )
      }
      this.commit('value', value)
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
