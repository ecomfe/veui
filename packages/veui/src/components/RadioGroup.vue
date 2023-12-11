<template>
<div
  :class="$c('radio-group')"
  :ui="realUi"
  role="radiogroup"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
>
  <div :class="$c('radio-group-items')">
    <veui-radio
      v-for="(item, index) in items"
      :ref="`b-${item.value}`"
      :key="index"
      :name="localName"
      :value="item.value"
      :model="realValue"
      :disabled="item.disabled || realDisabled || realReadonly"
      :checked="item.value === realValue"
      :aria-posinset="index + 1"
      :aria-setsize="items.length"
      @change="(checked) => handleChange(checked, item.value)"
      @mouseenter="handleEnterForDesc(item)"
    >
      <slot name="item" v-bind="item" :index="index">{{ item.label }}</slot>
    </veui-radio>
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
import ui from '../mixins/ui'
import input from '../mixins/input'
import { focusIn } from '../utils/dom'
import Radio from './Radio'
import Popover from './Popover'
import useDesc from '../mixins/button-group'
import useControllable from '../mixins/controllable'
import { uniqueId } from 'lodash'
import '../common/global'

export default {
  name: 'veui-radio-group',
  components: {
    'veui-radio': Radio,
    'veui-popover': Popover
  },
  mixins: [
    ui,
    input,
    useDesc,
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
    localName () {
      return this.realName || uniqueId('veui-radio-group-')
    }
  },
  methods: {
    handleChange (checked, value) {
      if (checked) {
        this.commit('value', value)
      }
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
