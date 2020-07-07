<template>
<div
  :class="[$c('radio-button-group'), $c('button-group')]"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
  @keydown.left="pick(-1)"
  @keydown.right="pick(1)"
>
  <veui-button
    v-for="(item, index) in items"
    ref="items"
    :key="index"
    :ui="uiParts.button"
    :class="{
      [$c('button-selected')]: index === activeIndex
    }"
    :disabled="item.disabled || realDisabled || realReadonly"
    role="radio"
    :aria-selected="index === activeIndex"
    :tabindex="index === activeIndex || activeIndex === -1 && index === 0 ? '0' : '-1'"
    @click="handleChange(item.value)"
  >
    <slot
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
import Button from './Button'
import useControllable from '../mixins/controllable'
import { findIndex } from 'lodash'

export default {
  name: 'veui-radio-button-group',
  components: {
    'veui-button': Button
  },
  mixins: [
    prefix,
    ui,
    input,
    useControllable({
      prop: 'value',
      event: 'change'
    })
  ],
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
    activeIndex () {
      return findIndex(this.items, ({ value }) => value === this.realValue)
    }
  },
  methods: {
    handleChange (val) {
      this.setReal('value', val)
    },
    pick (step) {
      let length = this.items.length
      if (length <= 1) {
        return
      }

      let index =
        ((this.activeIndex === -1 ? 0 : this.activeIndex) + step) % length
      this.setReal('value', this.items[index].value)

      this.$nextTick(() => {
        this.$refs.items[index].focus()
      })
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
