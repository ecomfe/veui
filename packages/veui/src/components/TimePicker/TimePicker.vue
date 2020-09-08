<template>
<div
  ref="self"
  :class="{
    [$c('time-picker')]: true,
    [$c('readonly')]: realReadonly,
    [$c('disabled')]: realDisabled
  }"
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
    autocomplete="off"
    @focus="openDropdown"
    @click="openDropdown"
  >
    <div
      slot="after"
      :class="$c('time-picker-icon')"
    >
      <veui-button
        v-if="clearable && localValue"
        :class="$c('time-picker-clear')"
        :ui="uiParts.clear"
        :aria-label="t('clear')"
        :disabled="realDisabled || realReadonly"
        @click="clear"
        @mouseup.stop
      >
        <veui-icon :name="icons.clear"/>
      </veui-button>
      <veui-icon
        :class="$c('time-picker-clock')"
        :name="icons.clock"
      />
    </div>
  </veui-input>
  <veui-overlay
    v-show="expanded"
    ref="overlay"
    target="self"
    match-width
    :overlay-class="
      mergeOverlayClass({
        [$c('time-picker-overlay')]: true
      })
    "
    :local="realOverlayOptions.local"
    :options="realOverlayOptions"
    :open="expanded"
    @afteropen="scrollSelectedToCenter(0)"
  >
    <div
      :id="dropdownId"
      v-outside:input="closeDropdown"
      :ui="realUi"
      :class="[
        $c('time-picker-overlay-content'),
        $c(`time-picker-overlay-${mode}`)
      ]"
    >
      <div
        ref="hour"
        key="hour"
        :class="$c('time-picker-option-group-wrapper')"
      >
        <veui-time-picker-option-group
          :ui="realUi"
          role="listbox"
          :aria-activedescendant="realValue[0] != null ? realValue[0] : false"
          :options="realHours"
          :value="realValue[0]"
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
        :class="$c('time-picker-option-group-wrapper')"
      >
        <veui-time-picker-option-group
          :ui="realUi"
          role="listbox"
          :aria-activedescendant="realValue[1] != null ? realValue[1] : false"
          :options="realMinutes"
          :value="realValue[1]"
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
        :class="$c('time-picker-option-group-wrapper')"
      >
        <veui-time-picker-option-group
          :ui="realUi"
          role="listbox"
          :aria-activedescendant="realValue[2] != null ? realValue[2] : false"
          :options="realSeconds"
          :value="realValue[2]"
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
import Button from '../Button'
import Icon from '../Icon'
import prefix from '../../mixins/prefix'
import dropdown from '../../mixins/dropdown'
import useControllable from '../../mixins/controllable'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import i18n from '../../mixins/i18n'
import {
  range,
  padStart,
  isEqual,
  includes,
  get,
  times,
  constant
} from 'lodash'
import config from '../../managers/config'
import { scrollToAlign } from '../../utils/dom'
import TimePickerUtil from './_TimePickerUtil'

const HOURS = range(24)
const MINUTES = range(60)
const SECONDS = MINUTES
const MODES = ['hour', 'minute', 'second']

config.defaults(
  {
    placeholder: '@@timepicker.placeholder'
  },
  'timepicker'
)

export default {
  name: 'veui-time-picker',
  components: {
    'veui-overlay': Overlay,
    'veui-time-picker-option-group': TimePickerOptionGroup,
    'veui-input': Input,
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [
    prefix,
    ui,
    input,
    dropdown,
    i18n,
    useControllable({
      prop: 'value',
      event: 'input',
      get (val) {
        return val ? ensureLength(toArray(val), this.datasource.length, 0) : []
      },
      set (val, commit) {
        // val 是数组, 默认 sameValue 是 === ，所以要自己判断下是否值相同
        // 因为同步出去都是字符串（local 和 prop 一般是一致的），所以 local 也用字符串
        if (!isEqual(val, this.realValue)) {
          commit(toString(val, this.minuteSuffix))
        }
      }
    })
  ],
  model: {
    event: 'input'
  },
  props: {
    value: String,
    hours: Array,
    minutes: Array,
    seconds: Array,
    placeholder: String,
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
      inputValue: null,
      availableData: null
    }
  },
  computed: {
    realPlaceholder () {
      return this.placeholder == null
        ? config.get('timepicker.placeholder')
        : this.placeholder
    },
    enableSeconds () {
      return this.mode === 'second'
    },
    enableMinutes () {
      return this.enableSeconds || this.mode === 'minute'
    },
    inputProps () {
      return {
        autofocus: this.autofocus,
        placeholder: this.realPlaceholder,
        readonly: this.realReadonly,
        disabled: this.realDisabled,
        invalid: this.realInvalid
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
            0
          ),
          max: ensureLength(
            toArray(this.max || '23:59:59'),
            datasource.length,
            59
          )
        },
        value: this.realValue
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
        return this.inputValue || toString(this.realValue, this.minuteSuffix)
      },
      set (val) {
        this.inputValue = val
        if (val) {
          val = toArray(val)
          if (!this.util.isAvailable(val, true)) {
            return
          }
        }
        this.realValue = val
        this.scrollSelectedToCenter()
      }
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
          this.availableData = this.util.setOptions(utilOptions).getAvailable()
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
    clear () {
      this.realInputValue = ''
      this.$emit('clear')
    },
    checkPropValidity () {
      if (this.value && !this.util.isAvailable(this.realValue, true)) {
        // TODO 需要恢复到之前的状态吗
        throw new Error('value prop is invalid!')
      }
    },
    scrollSelectedTime (viewport, duration) {
      if (viewport) {
        let selected = viewport.querySelector(`.${this.$c('option-selected')}`)
        if (selected) {
          scrollToAlign(viewport, selected, {
            targetPosition: 0.5,
            viewportPosition: 0.5,
            duration
          })
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
    openDropdown (e) {
      if (!this.expanded && !this.realReadonly && !this.realDisabled) {
        this.expanded = true
        this.valueOnOpen = [...this.realValue]
      }
    },
    closeDropdown () {
      if (this.expanded) {
        this.close()
        this.inputValue = ''
        if (!isEqual(this.valueOnOpen, this.realValue)) {
          this.$emit('change', toString(this.realValue, this.minuteSuffix))
        }
      }
    },
    handleDropdownChange (index, val) {
      let value = [...this.realValue]
      value[index] = val
      let hasEmpty =
        value.filter(i => i != null).length !== this.availableData.length
      if (hasEmpty || !this.util.isAvailable(value)) {
        value = this.util.getMinimumTimeOfIndex(index, val)
      }
      this.realValue = value
      this.scrollSelectedToCenter()

      // Close if only hours are available
      if (this.mode === 'hour') {
        this.closeDropdown()
      }
    },
    focus () {
      this.$refs.input.focus()
    }
  }
}

function toString (value, suffix, sep = ':') {
  if (!get(value, 'length')) {
    return ''
  }
  return value.map(i => padStart(i, 2, '0')).join(sep) + suffix
}

function toArray (value, sep = ':') {
  if (Array.isArray(value)) {
    return value
  }
  return value
    ? value
      .trim()
      .split(sep)
      .map(i => parseInt(i, 10))
    : []
}

function ensureLength (value, length, padding) {
  return value.length === length
    ? value
    : value.length > length
      ? value.slice(0, length)
      : value.concat(times(length - value.length, constant(padding)))
}

function genOption (opt, suffix = '') {
  return {
    label: `${padStart(opt, 2, '0')}${suffix}`,
    value: opt
  }
}

function sorter (a, b) {
  return a > b ? 1 : -1
}
</script>
