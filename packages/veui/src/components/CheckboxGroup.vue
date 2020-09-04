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
    :is="item.exclusive ? 'veui-radio' : 'veui-checkbox'"
    v-for="(item, index) in items"
    :key="index"
    :name="localName"
    :disabled="item.disabled || realDisabled || realReadonly"
    :checked="realValue.indexOf(item.value) !== -1"
    role="option"
    :aria-selected="realValue.indexOf(item.value) !== -1"
    :aria-posinset="index + 1"
    :aria-setsize="items.length"
    @change="checked => handleChange(item, checked)"
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
import { uniqueId, findIndex, includes } from 'lodash'
import Checkbox from './Checkbox'
import Radio from './Radio'
import useControllable from '../mixins/controllable'

export default {
  name: 'veui-checkbox-group',
  components: {
    'veui-checkbox': Checkbox,
    'veui-radio': Radio
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
    },
    /* eslint-disable vue/require-prop-types */
    emptyValue: {}
    /* eslint-enable vue/require-prop-types */
  },
  computed: {
    localName () {
      return this.realName || uniqueId('veui-checkbox-group-')
    },
    exclusiveItems () {
      return (this.items || []).filter(({ exclusive }) => !!exclusive)
    },
    exclusiveValues () {
      return this.exclusiveItems.map(({ value }) => value)
    }
  },
  methods: {
    handleChange ({ value, exclusive }, checked) {
      let values = [...this.realValue]
      if (!checked) { // checked 表示要选中
        // cancel
        values.splice(
          findIndex(values, item => item === value),
          1
        )
        // prop value 可能一开始就包含了如下 2 种错误情况
        let selectedExclusives = values.filter(val => includes(this.exclusiveValues, val))
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
        values = values.filter(val => !includes(this.exclusiveValues, val))
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
