<template>
<div
  :ui="realUi"
  :class="{
    [$c('date-picker')]: true,
    [$c('invalid')]: realInvalid,
    [$c('date-picker-range')]: range,
    [$c('date-picker-expanded')]: realExpanded,
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
        @click="activateByEnd = true"
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
        <veui-icon :name="icons.clear" :aria-label="t('clear')"/>
      </veui-button>
      <veui-icon :class="$c('date-picker-clock')" :name="icons.calendar"/>
    </div>
  </div>
  <veui-overlay
    ref="overlay"
    target="button"
    :open="realExpanded"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
    :local="realOverlayOptions.local"
    :options="realOverlayOptions"
    :priority="overlayPriority"
    autofocus
    modal
    match-width
    @afteropen="$refs.cal.scrollToCurrentYear()"
  >
    <div
      v-outside:button,inputs="close"
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
        :selected="realSelected"
        role="dialog"
        :class="$c('date-picker-calendar')"
        v-bind="calendarProps"
        :ui="uiParts.calendar"
        :panel="realPanel"
        tabindex="-1"
        @select="handleSelect"
        @selectstart="handleStart"
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
              :autofocus="activateByEnd ? null : ''"
              :mask="mask"
              @input="handleInput(0, $event)"
              @focus="handleInputFocus"
            />
            <template v-if="range">
              <span :class="$c('date-picker-tilde')">~</span>
              <veui-input
                ref="end"
                :value="realInputValue[1]"
                :ui="uiParts.input"
                :autofocus="activateByEnd ? '' : null"
                :mask="mask"
                @input="handleInput(1, $event)"
                @focus="handleInputFocus"
              />
            </template>
          </div>
        </template>
        <template v-if="$scopedSlots.date" slot="date" slot-scope="date">
          <slot name="date" v-bind="date"/>
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
import ui from '../mixins/ui'
import input from '../mixins/input'
import dropdown from '../mixins/dropdown'
import useControllable from '../mixins/controllable'
import i18n from '../mixins/i18n'
import config from '../managers/config'
import useConfig from '../mixins/config'
import warn from '../utils/warn'
import { startOf, toDateData, lt, add } from '../utils/date'
import { isNumber, pick, omit, defaults } from 'lodash'
import { format, parse } from 'date-fns'
import '../common/global'

config.defaults(
  {
    shortcuts: [],
    placeholder: '@@datepicker.selectDate',
    monthPlaceholder: '@@datepicker.selectMonth',
    yearPlaceholder: '@@datepicker.selectYear',
    rangePlaceholder: '@@datepicker.selectRange',
    monthRangePlaceholder: '@@datepicker.selectMonthRange',
    yearRangePlaceholder: '@@datepicker.selectYearRange',
    dateFormat: '@@datepicker.dateFormat',
    monthFormat: '@@datepicker.monthFormat',
    yearFormat: '@@datepicker.yearFormat'
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
  date: 'yyyy/MM/dd',
  month: 'yyyy/MM',
  year: 'yyyy'
}

const PLACEHOLDER_KEY_MAP = {
  date: 'datepicker.placeholder',
  month: 'datepicker.monthPlaceholder',
  year: 'datepicker.yearPlaceholder'
}

const RANGE_PLACEHOLDER_KEY_MAP = {
  date: 'datepicker.rangePlaceholder',
  month: 'datepicker.monthRangePlaceholder',
  year: 'datepicker.yearRangePlaceholder'
}

const FORMAT_KEY_MAP = {
  date: 'datepicker.dateFormat',
  month: 'datepicker.monthFormat',
  year: 'datepicker.yearFormat'
}

function dateFormatToMask (format) {
  return format.replace(/[yMd]/g, '#')
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
  mixins: [
    ui,
    input,
    dropdown(),
    i18n,
    useControllable({
      prop: 'selected',
      event: 'select',
      get (val) {
        if (this.range) {
          return Array.isArray(val)
            ? [val[0] || null, val[1] || null]
            : [null, null]
        }
        return val
      }
    }),
    useConfig('config', 'datepicker')
  ],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    selected: {
      type: [Array, Date]
    },
    clearable: Boolean,
    // array for range date-picker
    placeholder: [String, Array],
    format: {
      type: [String, Function]
    },
    parse: {
      type: Function
    },
    shortcuts: Array,
    ...pick(Calendar.props, CALENDAR_PROPS)
  },
  data () {
    return {
      picking: null,
      localSelected: null,
      localInputValue: [],
      activateByEnd: false,
      defaultOverlayOptions: {
        position: 'bottom-start'
      }
    }
  },
  computed: {
    realWeekStart: Calendar.computed.realWeekStart,
    realFormat () {
      return this.format || this.config[FORMAT_KEY_MAP[this.type]]
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
      return this.getFormatted(this.sortedSelection)
    },
    sorted () {
      return this.getSorted()
    },
    formatted () {
      return this.getFormatted(this.sorted)
    },
    calendarProps () {
      return pick(this, CALENDAR_PROPS)
    },
    realPlaceholder () {
      let placeholder = this.placeholder
      if (!placeholder) {
        let placeholderKey
        if (!this.range) {
          placeholderKey = PLACEHOLDER_KEY_MAP[this.type]
        } else {
          placeholderKey = RANGE_PLACEHOLDER_KEY_MAP[this.type]
        }
        placeholder = this.config[placeholderKey]
      }
      return [].concat(placeholder)
    },
    realPanel () {
      return this.range && this.type !== 'year' ? 2 : 1
    },
    realShortcuts () {
      let shortcuts = this.shortcuts || this.config['datepicker.shortcuts']
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
    },
    mask () {
      let format =
        typeof this.format === 'string'
          ? this.format
          : TYPE_FORMAT_MAP[this.type]
      return dateFormatToMask(format)
    }
  },
  watch: {
    realExpanded (val) {
      if (val) {
        // nextTick: overlay 内容可能还没渲染
        this.$nextTick(() => {
          if (this.realExpanded) {
            let cal = this.$refs.cal
            cal.setExpanded(false)
            let selected = [].concat(this.realSelected)
            if (selected[0]) {
              cal.navigate(selected)
            }
          }
        })
      } else {
        this.activateByEnd = false
      }
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
        let valid = !this.isDisabled(dates[0], dates[1] || null)
        if (this.range && valid) {
          valid =
            !this.isDisabled(dates[1], dates[0] || null) &&
            lt(dates[0], dates[1])
        }
        if (valid) {
          this.handleSelect(this.range ? dates : dates[0])
        }
      }
    },
    toggleExpanded (force) {
      if (this.realDisabled || this.realReadonly) {
        return
      }

      this.commit('expanded', force == null ? !this.realExpanded : force)
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
    getFormatted (value) {
      return Array.isArray(value)
        ? value.map((date) => this.formatDate(date))
        : this.formatDate(value)
    },
    handleInput (index, val) {
      this.$set(this.localInputValue, index, val)
      let cal = this.$refs.cal
      if (cal) {
        let result = []
        let date = this.parseDate(val) || null
        let another = this.range
          ? this.parseDate(this.realInputValue[1 - index])
          : null
        result[index] = this.isDisabled(date, another) ? null : date

        if (this.range) {
          result[1 - index] = another
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
      if (typeof this.realFormat === 'function') {
        return this.realFormat(date)
      }

      let dateFormat = this.realFormat || TYPE_FORMAT_MAP[this.type]
      dateFormat = checkFormat(dateFormat)
      return format(date, dateFormat)
    },
    parseDate (input) {
      let result = null
      input = input || ''
      if (typeof this.parse === 'function') {
        result = this.parse(input)
        return isNaN(+result) ? null : result
      }
      if (this.realFormat && typeof this.realFormat === 'string') {
        let dateFormat = checkFormat(this.realFormat)
        result = parse(input, dateFormat, new Date())
        return isNaN(+result) ? null : result
      }
      return null
    },
    toDateData (date) {
      if (!date) {
        return {}
      }
      return toDateData(date)
    },
    handleSelect (selected) {
      this.commit('selected', selected)
      this.commit('expanded', false)
      this.picking = null
      this.localInputValue = []
    },
    handleStart (picking) {
      this.$emit('selectstart', picking)
      return this.updateInput(picking)
    },
    handleProgress (picking) {
      this.$emit('selectprogress', picking)
      return this.updateInput(picking)
    },
    updateInput (picking) {
      this.picking = [].concat(picking)
      if (this.picking[0] && this.picking[1]) {
        this.picking.sort((a, b) => a - b)
      }
      this.localInputValue = this.picking.map((date) => this.formatDate(date))
    },
    handleViewChange () {
      this.$nextTick(() => {
        this.relocate()
      })
    },
    clear () {
      this.commit('selected', null)
      this.commit('expanded', false)
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
      this.commit('expanded', false)
      this.picking = null
      if (this.range) this.$refs.cal.pick(null)
      this.localInputValue = []
    },
    getDateByOffset (offset) {
      offset = isNumber(offset) ? { days: offset } : offset
      return add(
        startOf(this.today, offset.startOf || 'day', {
          weekStartsOn: this.realWeekStart
        }),
        omit(offset, 'startOf')
      )
    },
    handleHoverShortcut (picking) {
      // 点击快捷方式会触发面板关闭，即会触发 mouseleave，且在 Safari 上拿不到 refs.cal。
      if (this.$refs.cal) {
        this.$refs.cal.pick(picking)
      }
    },
    isDisabled (date, another) {
      return (
        !!date &&
        typeof this.disabledDate === 'function' &&
        !!this.disabledDate(date, another)
      )
    }
  }
}

function checkFormat (input) {
  if (input.indexOf('YYYY') >= 0) {
    warn('Use `yyyy` instead of `YYYY` when formatting years.')
    input = input.replace(/YYYY/, 'yyyy')
  }
  if (input.indexOf('DD') >= 0) {
    warn('Use `dd` instead of `DD` when formatting days of month.')
    input = input.replace(/DD/, 'dd')
  }
  return input
}
</script>
