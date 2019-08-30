<template>
<div
  ref="self"
  class="veui-time-picker"
  :ui="realUi"
  :aria-readonly="realReadonly"
  :aria-disabled="realDisabled"
  :aria-expanded="expanded"
  :aria-owns="dropdownId"
  aria-haspopup="listbox"
>
  <veui-input
    ref="input"
    v-model="realInputValue"
    v-bind="inputProps"
    @focus="openDropdown"
    @click="openDropdown"
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
    match-width
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
      :id="dropdownId"
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
          role="listbox"
          :aria-activedescendant="
            realLocalValue[0] != null ? realLocalValue[0] : false
          "
          :options="realHours"
          :value="realLocalValue[0]"
          @change="handleDropdownChange(0, $event)"
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
          role="listbox"
          :aria-activedescendant="
            realLocalValue[1] != null ? realLocalValue[1] : false
          "
          :options="realMinutes"
          :value="realLocalValue[1]"
          @change="handleDropdownChange(1, $event)"
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
          role="listbox"
          :aria-activedescendant="
            realLocalValue[2] != null ? realLocalValue[2] : false
          "
          :options="realSeconds"
          :value="realLocalValue[2]"
          @change="handleDropdownChange(2, $event)"
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
import {
  range,
  padStart,
  isEqual,
  includes,
  get,
  times,
  constant,
  pick
} from 'lodash'
import { scrollToCenter } from '../../utils/dom'
import TimePickerUtil from './_TimePickerUtil'

const genOption = (o, suffix = '') => ({
  label: `${padStart(o, 2, '0')}${suffix}`,
  value: o
})

const sorter = (a, b) => (a > b ? 1 : -1)

const toString = (value, suffix, sep = ':') => {
  if (!get(value, 'length')) {
    return ''
  }
  return value.map(i => padStart(i, 2, '0')).join(sep) + suffix
}

const toArray = (value, sep = ':') =>
  value
    ? value
      .trim()
      .split(sep)
      .map(i => parseInt(i, 10))
    : []

const ensureLength = (value, length, isMin) => {
  return value.length === length
    ? value
    : value.length > length
      ? value.slice(0, length)
      : value.concat(times(length - value.length, constant(isMin ? 0 : 59)))
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
    value: String,
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
    min: String,
    max: String,
    autofocus: Boolean,
    clearable: Input.props.clearable
  },
  data () {
    return {
      localValue: this.getRealPropValue(),
      inputValue: null,
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
    inputProps () {
      return {
        ...pick(this.$props, ['placeholder', 'autofocus', 'clearable']),
        readonly: this.realReadonly,
        disabled: this.realDisabled
      }
    },
    minuteSuffix () {
      return this.enableMinutes ? '' : ':00'
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
    datasource () {
      return this.enableSeconds
        ? [this.sortedHours, this.sortedMinutes, this.sortedSeconds]
        : this.enableMinutes
          ? [this.sortedHours, this.sortedMinutes]
          : [this.sortedHours]
    },
    // 为了实例化和校验
    checkOptions () {
      let datasource = this.datasource
      return {
        utilOptions: {
          datasource,
          min: ensureLength(
            toArray(this.min || '00:00:00'),
            datasource.length,
            true
          ),
          max: ensureLength(
            toArray(this.max || '23:59:59'),
            datasource.length,
            false
          )
        },
        value: this.realPropValue
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
        return (
          this.inputValue || toString(this.realLocalValue, this.minuteSuffix)
        )
      },
      set (val) {
        this.inputValue = val
        if (val) {
          val = toArray(val)
          if (!this.util.isAvailable(val, true)) {
            return
          }
        }
        val = val || null
        this.localValue = val
        this.syncValue(val)
      }
    },
    realPropValue () {
      return this.getRealPropValue()
    },
    realLocalValue () {
      return this.value === undefined ? this.localValue : this.realPropValue
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
    getRealPropValue () {
      return this.value
        ? ensureLength(toArray(this.value), this.datasource.length, true)
        : []
    },
    checkPropValidity () {
      if (this.value && !this.util.isAvailable(this.realPropValue, true)) {
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
      if (!isEqual(val, this.realPropValue)) {
        this.$forceUpdate()
        this.$emit('input', toString(val, this.minuteSuffix) || null)
        this.scrollSelectedToCenter()
      }
    },
    openDropdown (e) {
      if (!this.expanded && !this.realReadonly) {
        this.expanded = true
        this.initialValue = this.realLocalValue
      }
    },
    closeDropdown () {
      if (this.expanded) {
        this.close()
        this.inputValue = null
        if (!isEqual(this.initialValue, this.realLocalValue)) {
          this.$emit(
            'change',
            toString(this.realLocalValue, this.minuteSuffix) || null
          )
        }
      }
    },
    handleDropdownChange (index, val) {
      let value = [...this.realLocalValue]
      value[index] = val
      let hasEmpty =
        value.filter(i => i != null).length !== this.availableData.length
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
