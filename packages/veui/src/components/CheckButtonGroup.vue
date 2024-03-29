<template>
<div
  :class="[$c('check-button-group'), $c('button-group')]"
  :ui="realUi"
  role="listbox"
  aria-multiselectable="true"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
>
  <div :class="$c('check-button-group-items')">
    <veui-button
      v-for="(item, index) in items"
      :key="`b-${item.value}`"
      :ref="`b-${item.value}`"
      :ui="uiParts.button"
      :class="{
        [$c('button-selected')]: realValue.indexOf(item.value) !== -1,
        [$c('button-exclusive')]: !!item.exclusive
      }"
      :disabled="item.disabled || realDisabled || realReadonly"
      role="option"
      :aria-selected="realValue.indexOf(item.value) !== -1"
      :aria-posinset="index + 1"
      :aria-setsize="items.length"
      @click="handleChange(item)"
      @mouseenter="handleEnterForDesc(item)"
    >
      <div
        v-if="!item.exclusive"
        :key="`i-${item.value}`"
        :class="$c('check-button-group-checkmark')"
        aria-hidden="true"
      >
        <veui-icon :name="icons.check"/>
      </div>
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
import { includes, findIndex } from 'lodash'
import Button from './Button'
import Icon from './Icon'
import useControllable from '../mixins/controllable'
import useDesc from '../mixins/button-group'
import Popover from './Popover'
import '../common/global'

export default {
  name: 'veui-check-button-group',
  components: {
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-popover': Popover
  },
  mixins: [
    prefix,
    ui,
    input,
    useControllable({
      prop: 'value',
      event: 'change',
      get (val) {
        return val || []
      }
    }),
    useDesc
  ],
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
    },
    /* eslint-disable vue/require-prop-types */
    emptyValue: {}
    /* eslint-enable vue/require-prop-types */
  },
  computed: {
    exclusiveItems () {
      return (this.items || []).filter(({ exclusive }) => !!exclusive)
    },
    exclusiveValues () {
      return this.exclusiveItems.map(({ value }) => value)
    }
  },
  methods: {
    handleChange ({ value, exclusive }) {
      let values = [...this.realValue]
      if (includes(values, value)) {
        // cancel
        values.splice(
          findIndex(values, (item) => item === value),
          1
        )
        // prop value 可能一开始就包含了如下 2 种错误情况
        let selectedExclusives = values.filter((val) =>
          includes(this.exclusiveValues, val)
        )
        let exLen = selectedExclusives.length
        if (
          exLen > 1 || // 1. 太多 exclusive
          (exLen && values.length !== exLen) // 2. 都包含
        ) {
          values = [selectedExclusives[0]]
        }
      } else if (exclusive) {
        // select exclusive: only take current exclusive value
        values = [value]
      } else {
        // select inclusive: remove all exclusive values
        values = values.filter((val) => !includes(this.exclusiveValues, val))
        values.push(value)
      }

      // 处理 empty
      if (!values.length && typeof this.emptyValue !== 'undefined') {
        values = [this.emptyValue]
      }

      this.commit('value', values)
    },
    focus () {
      focusIn(this.$el)
    }
  }
}
</script>
