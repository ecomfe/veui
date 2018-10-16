<template>
<div class="veui-date-picker" :ui="realUi"
  :class="{
    'veui-input-invalid': realInvalid,
    'veui-date-picker-empty': !selected,
    'veui-date-picker-range': range,
    'veui-date-picker-expanded': expanded
  }">
  <veui-button
    ref="button"
    class="veui-date-picker-button"
    :disabled="realDisabled || realReadonly"
    :aria-disabled="realDisabled"
    :aria-readonly="realReadonly"
    aria-haspopup="dialog"
    @click="expanded = !expanded"
    @keydown.down.up.prevent="expanded = true">
    <template v-if="range">
      <span class="veui-date-picker-label">
        <slot
          v-if="selected && selected[0]"
          name="selected"
          position="from"
          v-bind="toDateData(selected[0])"
          :formatted="formatted ? formatted[0] : null">{{ formatted[0] }}</slot>
        <slot v-else name="placeholder">{{ realPlaceholder }}</slot>
      </span>
      <span class="veui-date-picker-tilde">~</span>
      <span class="veui-date-picker-label">
        <slot
          v-if="selected && selected[1]"
          name="selected"
          position="to"
          v-bind="toDateData(selected[1])"
          :formatted="formatted ? formatted[1] : null">{{ formatted[1] }}</slot>
      </span>
    </template>
    <template v-else>
      <span class="veui-date-picker-label">
        <slot
          v-if="selected"
          name="selected"
          v-bind="toDateData(selected)"
          :formatted="formatted">{{ formatted }}</slot>
        <slot v-else name="placeholder">{{ realPlaceholder }}</slot>
      </span>
    </template>
    <veui-icon class="veui-date-picker-icon" :name="icons.calendar"/>
  </veui-button>
  <button v-if="clearable && !!selected" type="button" class="veui-date-picker-clear veui-sr-only" @click="clear">
    <veui-icon :name="icons.clear" label="清除"/>
  </button>
  <veui-overlay
    target="button"
    :open="expanded"
    :options="realOverlayOptions"
    :overlay-class="overlayClass"
    autofocus
    modal>
    <veui-calendar
      role="dialog"
      class="veui-date-picker-overlay"
      v-model="localSelected"
      v-bind="calendarProps"
      ref="cal"
      :ui="uiParts.calendar"
      v-outside:button="close"
      @select="handleSelect"
      @selectstart="handleProgress"
      @selectprogress="handleProgress"
      :panel="realPanel"
      tabindex="-1"
      @keydown.esc.native="close">
      <template :slot="shortcutsPosition" v-if="range && realShortcuts && realShortcuts.length">
        <div class="veui-date-picker-shortcuts">
          <button v-for="({from, to, label}, index) in realShortcuts" type="button" :key="index"
            :class="{
              'veui-date-picker-shortcut': true,
              'veui-date-picker-shortcut-selected': isShortcutSelected({from, to})
            }" @click="handleSelect([from, to])"
            @mouseenter="handleHoverShortcut([from, to])"
            @mouseleave="handleHoverShortcut()">{{ label }}</button>
        </div>
      </template>
      <template v-if="$scopedSlots.date" slot="date" slot-scope="date">
        <slot name="date" v-bind="date"/>
      </template>
    </veui-calendar>
  </veui-overlay>
</div>
</template>

<script>
import Button from './Button'
import Overlay from './Overlay'
import Calendar from './Calendar'
import Icon from './Icon'
import dropdown from '../mixins/dropdown'
import input from '../mixins/input'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import config from '../managers/config'
import { toDateData } from '../utils/date'
import { isNumber, pick, omit, keys } from 'lodash'
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

config.defaults({
  shortcuts: [],
  shortcutsPosition: 'before',
  placeholder: '选择时间',
  rangePlaceholder: '选择时间段'
}, 'datepicker')

const CALENDAR_PROPS = [
  'range', 'weekStart', 'fillMonth',
  'today', 'disabledDate', 'dateClass'
]

export default {
  name: 'veui-date-picker',
  components: {
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-calendar': Calendar,
    'veui-icon': Icon
  },
  mixins: [ui, dropdown, input, overlay],
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
      type: [String, Function],
      default: 'YYYY-MM-DD'
    },
    shortcuts: {
      type: Array,
      default () {
        return config.get('datepicker.shortcuts')
      }
    },
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
      localSelected: this.selected
    }
  },
  computed: {
    formatted () {
      let selected = this.localSelected
      if (this.range) {
        let current = this.picking || selected
        if (Array.isArray(current)) {
          return current.map(date => this.formatDate(date))
        }
      }
      if (!selected) {
        return ''
      }
      return this.formatDate(selected)
    },
    calendarProps () {
      return pick(this, CALENDAR_PROPS)
    },
    realPlaceholder () {
      return this.placeholder ||
        (this.range
          ? config.get('datepicker.rangePlaceholder')
          : config.get('datepicker.placeholder'))
    },
    realPanel () {
      return this.panel || (this.range ? 2 : 1)
    },
    realShortcuts () {
      if (!this.shortcuts) {
        return null
      }
      return this.shortcuts.map(({from = 0, to = 0, label}) => {
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
    formatDate (date) {
      if (!date) {
        return ''
      }
      if (typeof this.format === 'function') {
        return this.format(date)
      }
      return format(date, this.format)
    },
    toDateData (date) {
      if (!date) {
        return {}
      }
      return toDateData(date)
    },
    handleSelect (selected) {
      this.$emit('select', selected)
      this.picking = null
      this.expanded = false
    },
    handleProgress (picking) {
      this.picking = Array.isArray(picking) ? picking : [picking]
    },
    clear (e) {
      this.$emit('select', null)
      this.expanded = false
      this.$nextTick(() => {
        this.$refs.button.focus()
      })
    },
    close () {
      this.expanded = false
      this.picking = null
    },
    getDateByOffset (offset) {
      offset = isNumber(offset) ? { days: offset } : offset
      return add(
        startOf(
          this.today, offset.startOf || 'day',
          { weekStartsOn: this.weekStart }
        ),
        omit(offset, 'startOf')
      )
    },
    isShortcutSelected ({ from, to }) {
      let selected = this.picking || this.localSelected
      if (!selected) {
        return false
      }
      if (selected[0] < selected[1]) {
        return from - selected[0] === 0 && to - selected[1] === 0
      }
      return to - selected[0] === 0 && from - selected[1] === 0
    },
    handleHoverShortcut (picking) {
      this.$refs.cal.picking = picking || null
    }
  },
  watch: {
    selected (value) {
      this.localSelected = value
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
  return keys(offset).reduce((acc, key) => {
    if (key in ADD_FN_MAP && offset[key] !== 0) {
      return ADD_FN_MAP[key](acc, offset[key])
    }
    return acc
  }, base)
}
</script>
