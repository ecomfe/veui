<template>
<div
  :ui="realUi"
  :class="{
    [$c('date-picker')]: true,
    [$c('input-invalid')]: realInvalid,
    [$c('date-picker-range')]: range,
    [$c('date-picker-expanded')]: expanded,
    [$c('disabled')]: realDisabled,
    [$c('readonly')]: realReadonly
  }"
>
  <div
    ref="button"
    :class="{
      [$c('date-picker-trigger')]: true
    }"
    :aria-disabled="realDisabled"
    :tabindex="realDisabled ? null : '0'"
    :aria-readonly="realReadonly"
    :aria-owns="dropdownId"
    aria-haspopup="dialog"
    @click="toggleExpanded()"
    @keydown.down.enter.up.prevent="toggleExpanded(true)"
  >
    <veui-input
      :disabled="realDisabled"
      :readonly="realReadonly"
      :placeholder="realPlaceholder[0]"
      :value="range ? formattedSelection[0] : formattedSelection"
      :class="{
        [$c('date-picker-label')]: true,
        [$c('disabled')]: realDisabled,
        [$c('readonly')]: realReadonly
      }"
      tabindex="-1"
    />
    <template v-if="range">
      <span :class="$c('date-picker-tilde')">~</span>
      <veui-input
        :class="{
          [$c('date-picker-label')]: true,
          [$c('disabled')]: realDisabled,
          [$c('readonly')]: realReadonly
        }"
        :disabled="realDisabled"
        :readonly="realReadonly"
        :value="formattedSelection[1]"
        :placeholder="realPlaceholder[1]"
        tabindex="-1"
      />
    </template>
    <div :class="$c('date-picker-icon')">
      <veui-button
        v-if="clearable && realSelected"
        :class="$c('date-picker-clear')"
        :ui="uiParts.clear"
        :aria-label="t('clear')"
        :disabled="realDisabled || realReadonly"
        @click.stop="clear"
        @mouseup.stop
      >
        <veui-icon
          :name="icons.clear"
          :label="t('clear')"
        />
      </veui-button>
      <veui-icon
        :class="$c('date-picker-clock')"
        :name="icons.calendar"
      />
    </div>
  </div>
  <veui-overlay
    ref="overlay"
    target="button"
    :open="expanded"
    :options="realOverlayOptions"
    :overlay-class="overlayClass"
    position="top-start"
    autofocus
    modal
    @afteropen="$refs.cal.scrollToCurrentYear()"
  >
    <div
      :ui="realUi"
      :class="$c('date-picker-overlay-content')"
    >
      <div
        v-if="range && realShortcuts && realShortcuts.length"
        :class="$c('date-picker-shortcuts')"
      >
        <button
          v-for="({ from, to, label }, index) in realShortcuts"
          :key="index"
          type="button"
          :class="$c('date-picker-shortcut')"
          @click="handleSelect([from, to])"
          @mouseenter="handleHoverShortcut([from, to])"
          @mouseleave="handleHoverShortcut()"
        >
          {{ label }}
        </button>
      </div>
      <veui-calendar
        :id="dropdownId"
        ref="cal"
        v-model="realSelected"
        v-outside:button,inputs="close"
        role="dialog"
        :class="$c('date-picker-calendar')"
        v-bind="calendarProps"
        :ui="uiParts.calendar"
        :panel="realPanel"
        tabindex="-1"
        @select="handleSelect"
        @selectstart="handleProgress"
        @selectprogress="handleProgress"
        @keydown.esc.native="close"
        @keydown.enter.native="suggest"
        @viewchange="handleViewChange"
      >
        <template slot="before">
          <div
            ref="inputs"
            :class="$c('date-picker-inputs')"
            @keydown.up.down.prevent="$refs.cal.focus()"
          >
            <veui-input
              ref="start"
              :value="realInputValue[0]"
              :ui="uiParts.input"
              autofocus
              @input="handleInput(0, $event)"
              @focus="handleInputFocus"
            />
            <template v-if="range">
              <span :class="$c('date-picker-tilde')">~</span>
              <veui-input
                ref="end"
                :value="realInputValue[1]"
                :ui="uiParts.input"
                @input="handleInput(1, $event)"
                @focus="handleInputFocus"
              />
            </template>
          </div>
        </template>
        <template
          v-if="$scopedSlots.date"
          slot="date"
          slot-scope="date"
        >
          <slot
            name="date"
            v-bind="date"
          />
        </template>
      </veui-calendar>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import Button from './Button'
import Overlay from './Overlay'
import Input from './Input'
import Calendar from './Calendar'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import dropdown from '../mixins/dropdown'
import i18n from '../mixins/i18n'
import config from '../managers/config'
import { toDateData, getExactDateData, lt } from '../utils/date'
import { isNumber, pick, omit, defaults } from 'lodash'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfDay from 'date-fns/startOfDay'
import startOfWeek from 'date-fns/startOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import startOfQuarter from 'date-fns/startOfQuarter'
import startOfYear from 'date-fns/startOfYear'
import addDays from 'date-fns/addDays'
import addWeeks from 'date-fns/addWeeks'
import addMonths from 'date-fns/addMonths'
import addQuarters from 'date-fns/addQuarters'
import addYears from 'date-fns/addYears'

config.defaults(
  {
    shortcuts: [],
    placeholder: '@@datepicker.selectDate',
    monthPlaceholder: '@@datepicker.selectMonth',
    yearPlaceholder: '@@datepicker.selectYear',
    rangePlaceholder: '@@datepicker.selectRange',
    monthRangePlaceholder: '@@datepicker.selectMonthRange',
    yearRangePlaceholder: '@@datepicker.selectYearRange'
  },
  'datepicker'
)

const CALENDAR_PROPS = [
  'type',
  'range',
  'weekStart',
  'fillMonth',
  'today',
  'disabledDate',
  'dateClass'
]

const TYPE_FORMAT_MAP = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy'
}

const DEFAULT_DATE_SEP = '[/.-]'

export default {
  name: 'veui-date-picker',
  components: {
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-calendar': Calendar,
    'veui-icon': Icon,
    'veui-input': Input
  },
  mixins: [prefix, ui, input, dropdown, i18n],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    selected: {
      type: [Array, Date],
      default () {
        return null
      }
    },
    clearable: Boolean,
    placeholder: String,
    format: {
      type: [String, Function]
    },
    shortcuts: Array,
    ...pick(Calendar.props, CALENDAR_PROPS)
  },
  data () {
    return {
      picking: null,
      localSelected: null,
      localInputValue: [],
      localOverlayOptions: {
        inner: {
          enabled: true
        }
      }
    }
  },
  computed: {
    realSelected: {
      get () {
        return this.selected === undefined ? this.localSelected : this.selected
      },
      set (val) {
        this.localSelected = val
        this.$emit('select', val)
      }
    },
    realInputValue () {
      let formatted = [].concat(this.formatted)
      return this.localInputValue.length
        ? defaults(this.localInputValue, formatted)
        : formatted
    },
    sortedSelection () {
      return this.getSorted(true)
    },
    formattedSelection () {
      let current = this.sortedSelection
      return Array.isArray(current)
        ? current.map(date => this.formatDate(date))
        : this.formatDate(current)
    },
    sorted () {
      return this.getSorted()
    },
    formatted () {
      let current = this.sorted
      return Array.isArray(current)
        ? current.map(date => this.formatDate(date))
        : this.formatDate(current)
    },
    calendarProps () {
      return pick(this, CALENDAR_PROPS)
    },
    realPlaceholder () {
      let placeholder = this.placeholder
      if (!placeholder) {
        if (!this.range) {
          placeholder = config.get(
            {
              date: 'datepicker.placeholder',
              month: 'datepicker.monthPlaceholder',
              year: 'datepicker.yearPlaceholder'
            }[this.type]
          )
        } else {
          placeholder = config.get(
            {
              date: 'datepicker.rangePlaceholder',
              month: 'datepicker.monthRangePlaceholder',
              year: 'datepicker.yearRangePlaceholder'
            }[this.type]
          )
        }
      }
      return [].concat(placeholder)
    },
    realPanel () {
      return this.range && this.type !== 'year' ? 2 : 1
    },
    realShortcuts () {
      let shortcuts = this.shortcuts || config.get('datepicker.shortcuts')
      if (!shortcuts) {
        return null
      }
      return shortcuts.map(({ from = 0, to = 0, label }) => {
        from = this.getDateByOffset(from)
        to = this.getDateByOffset(to)
        if (from > to) {
          return {
            label,
            from: to,
            to: from
          }
        }
        return {
          label,
          from,
          to
        }
      })
    }
  },
  methods: {
    suggest () {
      let dates = []
      let len = this.range ? 2 : 1
      for (let i = 0; i < len; i++) {
        let date = this.parseDate(this.localInputValue[i])
        if (date) {
          dates.push(date)
        } else {
          return
        }
      }
      if (dates.length) {
        if (!this.range || (this.range && lt(dates[0], dates[1]))) {
          this.handleSelect(this.range ? dates : dates[0])
        }
      }
    },
    toggleExpanded (force) {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.expanded = force == null ? !this.expanded : force
      if (this.expanded) {
        let cal = this.$refs.cal
        cal.setExpanded(false)
        let selected = [].concat(this.realSelected)
        if (selected[0]) {
          cal.navigate(selected)
        }
      }
    },
    handleInputFocus () {
      this.$refs.cal.stopMousePicking()
    },
    moveFocus () {
      this.$refs.cal.focus()
    },
    getSorted (onlySelected) {
      if (this.range) {
        let current = onlySelected
          ? this.realSelected
          : this.picking || this.realSelected
        if (Array.isArray(current)) {
          if (current[0] && current[1]) {
            current = [].concat(current).sort((d1, d2) => d1 - d2)
          }
          return current
        }
      }
      return this.realSelected
    },
    handleInput (index, val) {
      this.$set(this.localInputValue, index, val)
      let cal = this.$refs.cal
      if (cal) {
        let result = []
        let date = this.parseDate(val)
        result[index] = date || null

        if (this.range) {
          // 要重新parse，因为可能范围原来不对，现在对了
          let another = this.parseDate(this.realInputValue[1 - index])
          result[1 - index] = another || null

          let rangeError = date && another && result[0] > result[1]
          if (rangeError) {
            result[index] = null
          }
          if (!result[0] && !result[1]) {
            // [] 用来覆盖 selected 的值
            return cal.pick([])
          }
        }
        if (result[index]) {
          cal.navigate(index, toDateData(date))
        }
        cal.pick(this.range ? result : result[index])
      }
    },
    formatDate (date) {
      if (!date) {
        return ''
      }
      if (typeof this.format === 'function') {
        return this.format(date)
      }

      let dateFormat = this.format || TYPE_FORMAT_MAP[this.type]
      dateFormat = checkFormat(dateFormat)
      return format(date, dateFormat)
    },
    parseDate (input) {
      // todo 定制了就一定要使用方 parse 了，是不是加个 parse prop？
      let result = null
      input = input || ''
      if (typeof this.format === 'function') {
        result = this.format(input)
        return isNaN(+result) ? null : result
      }
      if (this.format && typeof this.format === 'string') {
        let dateFormat = checkFormat(this.format)
        result = parse(input, dateFormat, new Date())
        return isNaN(+result) ? null : result
      }
      let data = getExactDateData(input, this.type, DEFAULT_DATE_SEP)
      return data ? new Date(data.year, data.month || 0, data.date || 1) : null
    },
    toDateData (date) {
      if (!date) {
        return {}
      }
      return toDateData(date)
    },
    handleSelect (selected) {
      this.realSelected = selected
      this.picking = null
      this.expanded = false
      this.localInputValue = []
    },
    handleProgress (picking) {
      this.picking = [].concat(picking)
      if (this.picking[0] && this.picking[1]) {
        this.picking.sort((a, b) => a - b)
      }
      this.localInputValue = this.picking.map(date => this.formatDate(date))
    },
    handleViewChange () {
      this.$nextTick(() => {
        this.relocate()
      })
    },
    clear (e) {
      this.realSelected = null
      this.expanded = false
      this.localInputValue = []
      this.$nextTick(() => {
        this.focus()
      })
    },
    focus () {
      this.$refs.button.focus()
    },
    close () {
      let cal = this.$refs.cal
      if (!cal.isMousePicking()) this.suggest()
      this.expanded = false
      this.picking = null
      if (this.range) this.$refs.cal.pick(null)
      this.localInputValue = []
    },
    getDateByOffset (offset) {
      offset = isNumber(offset) ? { days: offset } : offset
      return add(
        startOf(this.today, offset.startOf || 'day', {
          weekStartsOn: this.weekStart
        }),
        omit(offset, 'startOf')
      )
    },
    handleHoverShortcut (picking) {
      this.$refs.cal.pick(picking)
    }
  }
}

function startOf (base, startOf, { weekStartsOn }) {
  switch (startOf) {
    case 'day':
      return startOfDay(base)
    case 'week':
      return startOfWeek(base, { weekStartsOn })
    case 'month':
      return startOfMonth(base)
    case 'quarter':
      return startOfQuarter(base)
    case 'year':
      return startOfYear(base)
    default:
      throw new Error('Invalid argument for `startOf`.')
  }
}

const ADD_FN_MAP = {
  days: addDays,
  weeks: addWeeks,
  months: addMonths,
  quarters: addQuarters,
  years: addYears
}

function add (base, offset) {
  return Object.keys(offset).reduce((acc, key) => {
    if (key in ADD_FN_MAP && offset[key] !== 0) {
      return ADD_FN_MAP[key](acc, offset[key])
    }
    return acc
  }, base)
}

function checkFormat (input) {
  if (input.indexOf('YYYY') >= 0) {
    console.warn('Use `yyyy` instead of `YYYY` for formatting years')
    input = input.replace(/YYYY/, 'yyyy')
  }
  if (input.indexOf('DD') >= 0) {
    console.warn('Use `dd` instead of `DD` for formatting dates')
    input = input.replace(/DD/, 'dd')
  }
  return input
}
</script>
