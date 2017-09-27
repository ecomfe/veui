<template>
<div class="veui-date-picker" :ui="ui"
  :class="{
    'veui-date-picker-empty': !selected,
    'veui-date-picker-range': range,
    'veui-date-picker-expanded': expanded
  }">
  <veui-button ref="button" class="veui-date-picker-button" :ui="ui" :disabled="realDisabled || realReadonly" @click="expanded = !expanded">
    <template v-if="range">
      <span class="veui-date-picker-label">
        <slot v-if="formatted" name="date" :formatted="formatted ? formatted[0] : null" :date="selected ? selected[0] : null">{{ formatted[0] }}</slot>
        <slot v-else name="placeholder-begin">{{ placeholderBegin }}</slot>
      </span>
      <span class="veui-date-picker-tilde">~</span>
      <span class="veui-date-picker-label">
        <slot v-if="formatted" name="date" :formatted="formatted ? formatted[1] : null" :date="selected ? selected[1] : null">{{ formatted[1] }}</slot>
        <slot v-else name="placeholder-end">{{ placeholderEnd }}</slot>
      </span>
    </template>
    <template v-else>
      <span class="veui-date-picker-label">
        <slot v-if="formatted" name="date" :date="formatted">{{ formatted }}</slot>
        <slot v-else name="placeholder">{{ placeholder }}</slot>
      </span>
    </template>
    <veui-icon class="veui-date-picker-icon" :name="icons.calendar"></veui-icon>
  </veui-button>
  <button v-if="clearable" v-show="!!selected" class="veui-date-picker-clear" @click="clear">
    <veui-icon :name="icons.clear"></veui-icon>
  </button>
  <veui-overlay v-if="expanded" target="button" :open="expanded" :options="realOverlayOptions" :overlay-class="overlayClass">
    <veui-calendar class="veui-date-picker-overlay" v-model="localSelected" v-bind="calendarProps" ref="cal"
      v-outside:button="close" @select="handleSelect" @selectstart="handleProgress" @selectprogress="handleProgress" :panel="realPanel">
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
    </veui-calendar>
  </veui-overlay>
</div>
</template>

<script>
import Button from './Button'
import Overlay from './Overlay'
import Calendar from './Calendar'
import Icon from './Icon'
import moment from 'moment'
import { dropdown, input, icons, overlay } from '../mixins'
import config from '../managers/config'
import { isNumber, pick, omit } from 'lodash'

config.defaults({
  shortcuts: [],
  shortcutsPosition: 'before',
  placeholder: '选择时间',
  placeholderBegin: '开始时间',
  placeholderEnd: '结束时间'
}, 'datepicker')

let calendarProps = ['range', 'weekStart', 'fillMonth', 'disabledDate', 'dateClass']

export default {
  name: 'veui-date-picker',
  components: {
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-calendar': Calendar,
    'veui-icon': Icon
  },
  mixins: [dropdown, input, icons, overlay],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    ui: String,
    selected: {
      type: [Array, Date],
      default () {
        return null
      }
    },
    panel: Number,
    clearable: Boolean,
    placeholder: {
      type: String,
      default () {
        return config.get('datepicker.placeholder')
      }
    },
    placeholderBegin: {
      type: String,
      default () {
        return config.get('datepicker.placeholderBegin')
      }
    },
    placeholderEnd: {
      type: String,
      default () {
        return config.get('datepicker.placeholderEnd')
      }
    },
    format: {
      type: String,
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
    ...pick(Calendar.props, calendarProps)
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
      return pick(this, calendarProps)
    },
    realPanel () {
      return this.panel || (this.range ? 2 : 1)
    },
    realShortcuts () {
      if (!this.shortcuts) {
        return null
      }
      return this.shortcuts.map(({from = 0, to, label}) => {
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
      return moment(date).format(this.format)
    },
    handleSelect (selected) {
      this.$emit('select', selected)
      this.picking = null
      this.expanded = false
    },
    handleProgress (picking) {
      this.picking = picking
    },
    clear (e) {
      this.$emit('select', null)
      this.expanded = false
    },
    close () {
      this.expanded = false
      this.picking = null
    },
    getDateByOffset (offset) {
      offset = isNumber(offset) ? { days: offset } : offset

      // set locale data according to current prop
      // and reset later
      let locale = moment.locale()
      let dow = moment.localeData().firstDayOfWeek()
      moment.updateLocale(locale, {
        week: {
          dow: this.weekStart
        }
      })
      let startOf = offset.startOf || 'day'
      let base = moment().startOf(startOf)
      moment.updateLocale(locale, {
        week: {
          dow
        }
      })
      return base.add(omit(offset, 'startOf')).toDate()
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
</script>
