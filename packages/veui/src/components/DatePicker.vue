<template>
<div
  :ui="realUi"
  :class="{
    [$c('date-picker')]: true,
    [$c('input-invalid')]: realInvalid,
    [$c('date-picker-empty')]: !selected,
    [$c('date-picker-range')]: range,
    [$c('date-picker-expanded')]: expanded
  }"
>
  <div
    ref="button"
    :class="{
      [$c('date-picker-trigger')]: true,
      [$c('disabled')]: realDisabled || realReadonly
    }"
    :aria-disabled="realDisabled"
    :aria-readonly="realReadonly"
    :aria-owns="dropdownId"
    aria-haspopup="dialog"
    @click="toggleExpanded()"
    @keydown.down.up.prevent="toggleExpanded(true)"
  >
    <veui-input
      :disabled="realDisabled"
      :placeholder="realPlaceholder[0]"
      :value="range ? formattedSelection[0] : formattedSelection"
      :class="$c('date-picker-label')"
    />
    <template v-if="range">
      <span :class="$c('date-picker-tilde')">~</span>
      <veui-input
        :class="$c('date-picker-label')"
        :disabled="realDisabled"
        :value="formattedSelection[1]"
        :placeholder="realPlaceholder[1]"
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
    inner
    autofocus
    modal
    @afteropen="$refs.cal.scrollCurrentYear()"
  >
    <div :class="$c('date-picker-overlay-content')">
      <div
        v-if="range && realShortcuts && realShortcuts.length"
        :class="$c('date-picker-shortcuts')"
      >
        <button
          v-for="({ from, to, label }, index) in realShortcuts"
          :key="index"
          type="button"
          :class="{
            [$c('date-picker-shortcut')]: true,
            [$c('date-picker-shortcut-selected')]: isShortcutSelected({
              from,
              to
            })
          }"
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
          >
            <veui-input
              :value="realInputValue[0]"
              @input="handleInput(0, $event)"
              @focus="handleInputFocus"
            />
            <template v-if="range">
              <span :class="$c('date-picker-connector')">~</span>
              <veui-input
                :value="realInputValue[1]"
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
import { toDateData, getExactDateData, toDate, dateLt } from '../utils/date'
import { isNumber, pick, omit, defaults } from 'lodash'
import format from 'date-fns/format'
import startOfDay from 'date-fns/start_of_day'
import startOfWeek from 'date-fns/start_of_week'
import startOfMonth from 'date-fns/start_of_month'
import startOfQuarter from 'date-fns/start_of_quarter'
import startOfYear from 'date-fns/start_of_year'
import addDays from 'date-fns/add_days'
import addWeeks from 'date-fns/add_weeks'
import addMonths from 'date-fns/add_months'
import addQuarters from 'date-fns/add_quarters'
import addYears from 'date-fns/add_years'

config.defaults(
  {
    shortcuts: [],
    shortcutsPosition: 'before',
    placeholder: '@@datepicker.selectDate',
    monthPlaceholder: '@@datepicker.selectMonth',
    yearPlaceholder: '@@datepicker.selectYear',
    rangePlaceholder: '@@datepicker.selectRange'
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
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY'
}

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
    panel: Number,
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
    shortcutsPosition: {
      type: String,
      default () {
        return config.get('datepicker.shortcutsPosition')
      }
    },
    ...pick(Calendar.props, CALENDAR_PROPS)
  },
  data () {
    return {
      picking: null,
      localSelected: null,
      localInputValue: [],
      localOverlayOptions: {
        position: 'top-start'
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
        if (this.type !== 'date') {
          placeholder = config.get(
            this.type === 'month'
              ? 'datepicker.monthPlaceholder'
              : 'datepicker.yearPlaceholder'
          )
        } else {
          placeholder = config.get(
            this.range
              ? 'datepicker.rangePlaceholder'
              : 'datepicker.placeholder'
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
        let data = getExactDateData(
          this.localInputValue[i] || '',
          this.type,
          '[/.-]'
        )
        if (data) {
          let { year, month = 0, date = 1 } = data
          dates.push(toDate({ year, month, date }))
        } else {
          return
        }
      }
      if (dates.length) {
        if (!this.range || (this.range && dateLt(dates[0], dates[1]))) {
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
      }
    },
    handleInputFocus () {
      this.$refs.cal.closeMousePicking()
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
        let dateData = getExactDateData(val, this.type, '[/.-]')
        result[index] = dateData
          ? new Date(dateData.year, dateData.month || 0, dateData.date || 1)
          : null
        if (!this.range) {
          if (dateData) {
            cal.navigate(index, dateData)
          }
          cal.pick(result[index])
          return
        }
        let another = getExactDateData(
          this.realInputValue[1 - index] || '',
          this.type,
          '[/.-]'
        )
        result[1 - index] = another
          ? new Date(another.year, another.month || 0, another.date || 1)
          : null

        let rangeError = dateData && another && result[0] > result[1]
        if (rangeError) {
          result[index] = null
        }
        if (!result[0] && !result[1]) {
          return cal.pick([])
        }
        if (result[index]) {
          cal.navigate(index, dateData)
        }
        cal.pick(result)
      }
    },
    formatDate (date) {
      if (!date || !isFinite(date)) {
        return ''
      }
      if (typeof this.format === 'function') {
        return this.format(date)
      }

      let dateFormat = this.format || TYPE_FORMAT_MAP[this.type]
      return format(date, dateFormat)
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
    isShortcutSelected ({ from, to }) {
      let selected = this.picking || this.realSelected
      if (!selected) {
        return false
      }
      if (selected[0] < selected[1]) {
        return from - selected[0] === 0 && to - selected[1] === 0
      }
      return to - selected[0] === 0 && from - selected[1] === 0
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
</script>
