<template>
<div
  :class="[$c('radio-button-group'), $c('button-group')]"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
  @keydown.left="pick(true)"
  @keydown.right="pick(false)"
>
  <div :class="$c('radio-button-group-items')">
    <veui-button
      v-for="(item, index) in items"
      :ref="`b-${item.value}`"
      :key="index"
      :ui="uiParts.button"
      :class="{
        [$c('button-selected')]: index === activeIndex
      }"
      :disabled="item.disabled || realDisabled || realReadonly"
      role="radio"
      :aria-selected="index === activeIndex"
      :tabindex="
        index === activeIndex || (activeIndex === -1 && index === 0)
          ? '0'
          : '-1'
      "
      @click="handleChange(item.value)"
      @mouseenter="handleEnterForDesc(item)"
    >
      <slot name="item" v-bind="item" :index="index">{{ item.label }}</slot>
    </veui-button>
  </div>
  <veui-popover
    v-if="currentForDesc"
    position="top"
    overlay-class="desc-popover"
    :target="$refs[`b-${currentForDesc.value}`]"
    :open.sync="openForDesc"
    trigger="hover"
  >
    <slot name="desc" v-bind="currentForDesc">{{ currentForDesc.desc }}</slot>
  </veui-popover>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import { focusIn } from '../utils/dom'
import Button from './Button'
import Popover from './Popover'
import useControllable from '../mixins/controllable'
import useDesc from '../mixins/button-group'
import { findIndex } from 'lodash'
import '../common/global'

export default {
  name: 'veui-radio-button-group',
  components: {
    'veui-button': Button,
    'veui-popover': Popover
  },
  mixins: [
    prefix,
    ui,
    input,
    useControllable({
      prop: 'value',
      event: 'change'
    }),
    useDesc
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
    },
    enabledItems () {
      return this.items.filter(({ disabled }) => !disabled)
    },
    activeEnabledIndex () {
      return findIndex(
        this.enabledItems,
        ({ value }) => value === this.realValue
      )
    }
  },
  methods: {
    handleChange (val) {
      this.commit('value', val)
    },
    pick (reverse) {
      if (this.realDisabled || this.enabledItems.length === 0) {
        return
      }

      let value
      if (this.realValue == null) {
        value = this.enabledItems[0].value
      } else {
        const step = reverse ? -1 : 1
        const { length } = this.enabledItems
        value =
          this.enabledItems[(this.activeEnabledIndex + step + length) % length]
            .value
      }
      this.commit('value', value)

      this.$nextTick(() => {
        if (this.$refs[`b-${value}`]) {
          this.$refs[`b-${value}`][0].focus()
        }
      })
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
