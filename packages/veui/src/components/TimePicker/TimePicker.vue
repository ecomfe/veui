<template>
<div
  ref="self"
  class="veui-time-picker"
>
  <veui-input
    ref="input"
    v-model="realInputValue"
    :clearable="clearable"
    :autofocus="autofocus"
    :placeholder="placeholder"
    :readonly="realReadonly"
    :disabled="realDisabled"
    @focus="openDropdown"
  >
    <veui-icon
      slot="append"
      :name="icons.clock"
    />
  </veui-input>
  <veui-overlay
    v-show="expanded"
    ref="overlay"
    target="self"
    :overlay-class="
      mergeOverlayClass({
        'veui-time-picker-overlay': true
      })
    "
    :open="expanded"
    :options="realOverlayOptions"
    @afteropen="scrollSelectedToCenter(0)"
  >
    <div
      v-outside:input="closeDropdown"
      :class="
        `veui-time-picker-overlay-content veui-time-picker-overlay-${mode}`
      "
    >
      <div
        ref="hour"
        key="hour"
        class="veui-time-picker-option-group-wrapper"
      >
        <veui-time-picker-option-group
          :ui="realUi"
          :options="realHours"
          :value="realLocalValue[0]"
          @update:value="handleDropdownChange(0, $event)"
        >
          <template
            slot="option"
            slot-scope="option"
          >
            <slot
              name="option"
              v-bind="{ ...option, part: 'hour' }"
            />
          </template>
        </veui-time-picker-option-group>
      </div>
      <div
        v-if="enableMinutes"
        ref="minute"
        key="minute"
        class="veui-time-picker-option-group-wrapper"
      >
        <veui-time-picker-option-group
          :ui="realUi"
          :options="realMinutes"
          :value="realLocalValue[1]"
          @update:value="handleDropdownChange(1, $event)"
        >
          <template
            slot="option"
            slot-scope="option"
          >
            <slot
              name="option"
              v-bind="{ ...option, part: 'minute' }"
            />
          </template>
        </veui-time-picker-option-group>
      </div>
      <div
        v-if="enableSeconds"
        ref="second"
        key="second"
        class="veui-time-picker-option-group-wrapper"
      >
        <veui-time-picker-option-group
          :ui="realUi"
          :options="realSeconds"
          :value="realLocalValue[2]"
          @update:value="handleDropdownChange(2, $event)"
        >
          <template
            slot="option"
            slot-scope="option"
          >
            <slot
              name="option"
              v-bind="{ ...option, part: 'second' }"
            />
          </template>
        </veui-time-picker-option-group>
      </div>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import Overlay from '../Overlay'
import TimePickerOptionGroup from './_TimePickerOptionGroup'
import Input from '../Input'
import Icon from '../Icon'
import dropdown from '../../mixins/dropdown'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import { range, padStart, isEqual, includes, get } from 'lodash'
import { scrollToCenter } from '../../utils/dom'
import TimePickerUtil from './_TimePickerUtil'

const genOption = (o, suffix = '') => ({
  label: `${padStart(o, 2, '0')}${suffix}`,
  value: o
})

const sorter = (a, b) => (a > b ? 1 : -1)

const formatTime = (time, sep = ':') => {
  if (!get(time, 'length')) {
    return ''
  }
  return time.map(i => padStart(i, 2, '0')).join(sep)
}

const HOURS = range(24)
const MINUTES = range(60)
const SECONDS = MINUTES
const MODES = ['hour', 'minute', 'second']

export default {
  name: 'veui-time-picker',
  components: {
    'veui-overlay': Overlay,
    'veui-time-picker-option-group': TimePickerOptionGroup,
    'veui-input': Input,
    'veui-icon': Icon
  },
  mixins: [ui, input, dropdown],
  model: {
    event: 'input'
  },
  props: {
    value: Array,
    hours: Array,
    minutes: Array,
    seconds: Array,
    placeholder: {
      type: String,
      default: '请选择时间'
    },
    mode: {
      type: String,
      default: 'second',
      validator (val) {
        return includes(MODES, val)
      }
    },
    min: Array,
    max: Array,
    autofocus: Boolean,
    clearable: Input.props.clearable
  },
  data () {
    return {
      localValue: [...(this.value || [])],
      inputValue: null,
      // 可用的数据源
      availableData: null
    }
  },
  computed: {
    enableSeconds () {
      return this.mode === 'second'
    },
    enableMinutes () {
      return this.enableSeconds || this.mode === 'minute'
    },
    minuteSuffix () {
      return !this.enableMinutes ? ':00' : ''
    },
    realMin () {
      return (
        this.min ||
        (this.enableSeconds ? [0, 0, 0] : this.enableMinutes ? [0, 0] : [0])
      )
    },
    realMax () {
      return (
        this.max ||
        (this.enableSeconds
          ? [23, 59, 59]
          : this.enableMinutes
            ? [23, 59]
            : [23])
      )
    },
    sortedHours () {
      return this.hours ? this.hours.sort(sorter) : HOURS
    },
    sortedMinutes () {
      return this.minutes ? this.minutes.sort(sorter) : MINUTES
    },
    sortedSeconds () {
      return this.seconds ? this.seconds.sort(sorter) : SECONDS
    },
    // 为了实例化和校验
    checkOptions () {
      return {
        utilOptions: {
          datasource: this.enableSeconds
            ? [this.sortedHours, this.sortedMinutes, this.sortedSeconds]
            : this.enableMinutes
              ? [this.sortedHours, this.sortedMinutes]
              : [this.sortedHours],
          min: this.realMin,
          max: this.realMax
        },
        value: this.value
      }
    },
    realHours () {
      return this.sortedHours.map(i => ({
        ...genOption(i, this.minuteSuffix),
        disabled: !includes(this.availableData[0], i)
      }))
    },
    realMinutes () {
      return this.sortedMinutes.map(i => ({
        ...genOption(i),
        disabled: !includes(this.availableData[1], i)
      }))
    },
    realSeconds () {
      return this.sortedSeconds.map(i => ({
        ...genOption(i),
        disabled: !includes(this.availableData[2], i)
      }))
    },
    realInputValue: {
      get () {
        if (this.inputValue) {
          return this.inputValue
        }
        let val = formatTime(this.realLocalValue)
        if (val) {
          val += this.minuteSuffix
        }
        return val
      },
      set (val) {
        this.inputValue = val
        if (val) {
          val = val.split(':').map(i => parseInt(i, 10))
          if (!this.util.isAvailable(val, true)) {
            return
          }
        }
        val = val || null
        this.localValue = val
        this.syncValue(val)
      }
    },
    realLocalValue () {
      return this.value === undefined ? this.localValue : this.value || []
    }
  },
  watch: {
    checkOptions: {
      handler (
        { utilOptions, value },
        { utilOptions: oldUtilOptions, value: oldValue } = {}
      ) {
        if (!this.util) {
          this.util = new TimePickerUtil()
        }
        if (!isEqual(utilOptions, oldUtilOptions)) {
          this.availableData = this.util
            .setOptions(utilOptions)
            .getAvailableDatasource()
          this.checkPropValidity()
        } else if (!isEqual(value, oldValue)) {
          this.checkPropValidity()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    checkPropValidity () {
      if (this.value && !this.util.isAvailable(this.value, true)) {
        // TODO 需要恢复到之前的状态吗
        throw new Error('value prop is invalid!')
      }
    },
    scrollSelectedTime (viewport, duration) {
      if (viewport) {
        let sel = viewport.querySelector('.veui-option-selected')
        if (sel) {
          let scroller = viewport.querySelector('.veui-option-group')
          scrollToCenter(viewport, scroller, sel, duration)
        }
      }
    },
    scrollSelectedToCenter (duration = 200) {
      this.$nextTick(() => {
        this.scrollSelectedTime(this.$refs.hour, duration)
        this.scrollSelectedTime(this.$refs.minute, duration)
        this.scrollSelectedTime(this.$refs.second, duration)
      })
    },
    syncValue (val) {
      if (!isEqual(val, this.value)) {
        this.$forceUpdate()
        this.$emit('input', val)
        this.scrollSelectedToCenter()
      }
    },
    openDropdown () {
      this.expanded = true
      this.startValue = this.realLocalValue
    },
    closeDropdown () {
      if (this.expanded) {
        this.close()
        this.inputValue = null
        if (!isEqual(this.startValue, this.realLocalValue)) {
          this.$emit('change', this.realLocalValue)
        }
      }
    },
    handleDropdownChange (index, val) {
      let value = [...this.realLocalValue]
      value[index] = val
      let hasEmpty =
        value.filter(i => i != null).length !== this.realMin.length
      if (hasEmpty || !this.util.isAvailable(value)) {
        value = this.util.getMinimumTimeOfIndex(index, val)
      }
      this.localValue = value
      this.syncValue(value)
    },
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
