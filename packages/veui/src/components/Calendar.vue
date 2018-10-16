<template>
<div
  class="veui-calendar"
  :ui="realUi"
  role="application"
  :aria-label="t('calendar')"
  :aria-disabled="realDisabled"
  :aria-readonly="realReadonly"
  @mouseleave="markEnd()">
  <slot name="before"/>
  <div
    v-for="(p, pIndex) in panels"
    :key="pIndex"
    :class="['veui-calendar-panel', `veui-calendar-${p.view}`]">
    <div class="veui-calendar-head" :aria-hidden="String(pIndex > 0)">
      <button
        type="button"
        ref="prev"
        :class="{
          'veui-calendar-prev': true,
          'veui-sr-only': pIndex !== 0 && p.view === 'days'
        }"
        :disabled="disabled || readonly"
        @click="step(false, p.view)"
        :aria-hidden="String(pIndex > 0)"
        :aria-label="getStepLabel(p.view, 'prev')"
        :aria-controls="`${id}:panel-title:${pIndex}`">
        <veui-icon :name="icons.prev"/>
      </button>
      <template v-if="p.view === 'days'">
        <button
          type="button"
          ref="year-select"
          class="veui-calendar-select"
          :disabled="disabled || readonly"
          @click="setView(pIndex, 'years')"
          :aria-label="t('selectYear', { year: p.year })">
          <b>{{ t('year', { year: p.year }) }}</b> <veui-icon :name="icons.expand"/>
        </button>
        <button
          type="button"
          ref="month-select"
          :id="`${id}:panel-title:${pIndex}`"
          class="veui-calendar-select"
          :disabled="disabled || readonly"
          @click="setView(pIndex, 'months')"
          :aria-label="t('selectMonth', { month: p.month + 1 })">
          <b>{{ t(`month`, { month: p.month + 1 }) || t(`monthsLong[${p.month}]`) }}</b> <veui-icon :name="icons.expand"/>
        </button>
      </template>
      <template v-else-if="p.view === 'months'">
        <span
          class="veui-calendar-label"
          :id="`${id}:panel-title:${pIndex}`">
          <b>{{ t('year', { year: p.year }) }}</b>
        </span>
      </template>
      <template v-else-if="p.view === 'years'">
        <span
          class="veui-calendar-label"
          :id="`${id}:panel-title:${pIndex}`">
          <b>{{ t('year', { year: p.year - p.year % 10 }) }}</b>–<b>{{ t('year', { year: p.year - p.year % 10 + 9 }) }}</b>
        </span>
      </template>
      <button
        type="button"
        ref="next"
        :class="{
          'veui-calendar-next': true,
          'veui-sr-only': pIndex !== panels.length - 1 && p.view === 'days'
        }"
        :disabled="disabled || readonly"
        @click="step(true, p.view)"
        :aria-label="getStepLabel(p.view, 'next')"
        :aria-controls="`${id}:panel-title:${pIndex}`">
        <veui-icon :name="icons.next"/>
      </button>
    </div>
    <div ref="body" class="veui-calendar-body" :class="{ 'veui-calendar-multiple-range': multiple && range }">
      <table>
        <template v-if="p.view === 'days'">
          <thead>
            <tr>
              <th v-for="index in 7" :key="index" :aria-label="getDayFullNames()[index - 1]">{{ getDayNames()[index - 1] }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, index) in p.weeks" :key="index">
              <td v-for="day in week"
                :key="`${day.year}-${day.month + 1}-${day.date}`"
                :class="getDateClass(day, p)">
                <button
                  type="button"
                  v-if="fillMonth && panel === 1 || day.month === p.month"
                  :disabled="realDisabled || realReadonly || day.isDisabled"
                  :autofocus="day.isFocus"
                  :aria-label="getLocaleString(day)"
                  :aria-current="day.isToday ? 'date' : null"
                  :tabindex="day.isFocus ? null : '-1'"
                  @click="selectDay(day)"
                  @mouseenter="markEnd(day)"
                  @focus="markEnd(day)"
                  @keydown.up.prevent="moveFocus(p.view, -7)"
                  @keydown.right.prevent="moveFocus(p.view, 1)"
                  @keydown.down.prevent="moveFocus(p.view, 7)"
                  @keydown.left.prevent="moveFocus(p.view, -1)">
                  <slot name="date" v-bind="{
                    year: day.year,
                    month: day.month,
                    date: day.date
                  }">{{ day.date }}</slot>
                </button>
              </td>
            </tr>
          </tbody>
        </template>
        <tbody v-else-if="p.view === 'months'">
          <tr v-for="i in 3" :key="i">
            <td v-for="j in 4" :class="getMonthClass(p, i, j)" :key="j">
              <button
                type="button"
                @click="selectMonth(pIndex, (i - 1) * 4 + j - 1)"
                @keydown.up.prevent="moveFocus(p.view, -4)"
                @keydown.right.prevent="moveFocus(p.view, 1)"
                @keydown.down.prevent="moveFocus(p.view, 4)"
                @keydown.left.prevent="moveFocus(p.view, -1)"
                :tabindex="i === 1 && j === 1 ? null : '-1'">
                {{ t('month', { month: (i - 1) * 4 + j }) || t(`monthsShort[${(i - 1) * 4 + j - 1}]`) }}
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="p.view === 'years'">
          <tr v-for="i in 3" :key="i">
            <td v-for="j in 4" :class="getYearClass(p, i, j)" :key="j">
              <button
                type="button"
                v-if="(i - 1) * 4 + j - 1 < 10"
                @click="selectYear(pIndex, p.year - p.year % 10 + (i - 1) * 4 + j - 1)"
                @keydown.up.prevent="moveFocus(p.view, getYearOffset(i, j, false))"
                @keydown.right.prevent="moveFocus(p.view, 1)"
                @keydown.down.prevent="moveFocus(p.view, getYearOffset(i, j, true))"
                @keydown.left.prevent="moveFocus(p.view, -1)"
                :tabindex="i === 1 && j === 1 ? null : '-1'">
                {{ p.year - p.year % 10 + (i - 1) * 4 + j - 1 }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <slot name="after"/>
</div>
</template>

<script>
import { getDaysInMonth, fromDateData, isSameDay, mergeRange } from '../utils/date'
import { closest, focusIn } from '../utils/dom'
import { sign, isPositive } from '../utils/math'
import { normalizeClass } from '../utils/helper'
import { flattenDeep, findIndex, uniqueId, upperFirst } from 'lodash'
import ui from '../mixins/ui'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import config from '../managers/config'
import Icon from './Icon'

config.defaults({
  'calendar.weekStart': 1
})

const CELL_SELECTOR = {
  days: '.veui-calendar-day',
  months: '.veui-calendar-month',
  years: '.veui-calendar-year'
}

const STEP_MAP = {
  days: 'month',
  months: 'year',
  years: 'decade'
}

export default {
  name: 'veui-calendar',
  mixins: [ui, input, i18n],
  model: {
    prop: 'selected',
    event: 'select'
  },
  components: {
    'veui-icon': Icon
  },
  props: {
    panel: {
      type: Number,
      default: 1
    },
    today: {
      type: Date,
      default () {
        return new Date()
      }
    },
    selected: {
      type: [Array, Date],
      default () {
        return null
      }
    },
    weekStart: {
      type: Number,
      default: config.get('calendar.weekStart'),
      validator (val) {
        return val >= 0 && val <= 6
      }
    },
    range: Boolean,
    multiple: Boolean,
    fillMonth: {
      type: Boolean,
      default: true
    },
    disabledDate: {
      type: Function,
      default: function () {
        return false
      }
    },
    dateClass: {
      type: [String, Array, Object, Function],
      default: function () {
        return {}
      }
    }
  },
  data () {
    let views = []
    for (let i = 0; i < this.panel; i++) {
      views[i] = 'days'
    }

    let current = this.getDefaultDate()

    let id = uniqueId('veui-calendar-')

    return {
      year: current.getFullYear(),
      month: current.getMonth(),
      views,
      id,
      picking: null,
      pickingRanges: null
    }
  },
  computed: {
    viewMonth () {
      return `${this.year}/${this.month}`
    },
    realSelected () {
      return this.selected ? this.selected : (this.multiple ? [] : null)
    },
    realPicking () {
      let [from, to] = this.picking || []
      if (to && to - from < 0) {
        return [to, from]
      }
      return this.picking
    },
    panels () {
      let panels = []
      for (let i = 0; i < this.panel; i++) {
        let year = this.year + Math.floor((this.month + i) / 12)
        let month = (this.month + i) % 12
        let view = this.views[i]

        let firstDayInMonth = new Date(year, month)
        let offset = (firstDayInMonth.getDay() + 7 - this.weekStart) % 7
        let daysInMonth = getDaysInMonth(year, month)
        let daysInPreviousMonth = getDaysInMonth(year, month - 1)
        let weekCount = Math.ceil((offset + daysInMonth) / 7)
        let weeks = []

        // 默认 focus 入口顺序：
        // 选中日 -> 当天 -> 本月第一天
        let selectedDay = null
        let today = null
        let firstDay = null

        for (let i = 0; i < weekCount; i++) {
          if (!weeks[i]) {
            weeks[i] = []
          }
          for (let j = 0; j < 7; j++) {
            if (i === 0 && j < offset) {
              weeks[i][j] = {
                date: daysInPreviousMonth + j + 1 - offset,
                month: (month + 11) % 12,
                year: month === 0 ? year - 1 : year
              }
            } else if (i * 7 + j - offset < daysInMonth) {
              weeks[i][j] = {
                date: i * 7 + j + 1 - offset,
                month: month,
                year: year
              }
            } else {
              weeks[i][j] = {
                date: i * 7 + j + 1 - offset - daysInMonth,
                month: (month + 1) % 12,
                year: month === 11 ? year + 1 : year
              }
            }
            let day = weeks[i][j]
            day.isDisabled = typeof this.disabledDate === 'function'
              ? this.disabledDate(fromDateData(day))
              : false
            if (day.month === month) {
              day.isToday = isSameDay(day, this.today)
              day.isSelected = this.isSelected(day)
              day.rangePosition = this.getRangePosition(day)

              if (!firstDay) {
                firstDay = day
              }

              // 如果本月已找到选中的日子就无需再处理了
              if (!selectedDay) {
                if (day.isSelected) {
                  day.isFocus = true
                  selectedDay = day
                } else if (!today && day.isToday) {
                  today = day
                }
              }
            }
          }
        }

        // 如果本月没有选中的日期时再选择当天或第一天
        if (!selectedDay) {
          if (today) {
            today.isFocus = true
          } else {
            firstDay.isFocus = true
          }
        }

        panels.push({
          year,
          month,
          weeks,
          view
        })
      }
      return panels
    }
  },
  methods: {
    getDayNames () {
      let names = [...this.t('daysShort')]
      return names.splice(this.weekStart - 1).concat(names)
    },
    getDayFullNames () {
      let names = [...this.t('daysLong')]
      return names.splice(this.weekStart - 1).concat(names)
    },
    getLocaleString (day) {
      return fromDateData(day).toLocaleDateString(this.getLocale(), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getDateClass (day, panel) {
      let extraClass = typeof this.dateClass === 'function'
        ? this.dateClass(fromDateData(day))
        : this.dateClass

      return {
        'veui-calendar-day': day.month === panel.month,
        'veui-calendar-aux': day.month !== panel.month,
        'veui-calendar-today': day.isToday,
        'veui-calendar-selected': day.isSelected,
        'veui-calendar-in-range': day.rangePosition && day.rangePosition.within,
        'veui-calendar-range-start': day.rangePosition && day.rangePosition.start,
        'veui-calendar-range-end': day.rangePosition && day.rangePosition.end,
        ...normalizeClass(extraClass)
      }
    },
    getMonthClass (panel, i, j) {
      let month = (i - 1) * 4 + j - 1
      return {
        'veui-calendar-month': true,
        'veui-calendar-today': month === this.today.getMonth() && panel.year === this.today.getFullYear(),
        'veui-calendar-selected': (this.realSelected && !this.multiple && !this.range)
          ? (month === this.realSelected.getMonth() && panel.year === this.realSelected.getFullYear()) : false
      }
    },
    getYearClass (panel, i, j) {
      let offset = (i - 1) * 4 + j - 1
      let year = panel.year - panel.year % 10 + offset
      return {
        'veui-calendar-year': offset < 10,
        'veui-calendar-today': year === this.today.getFullYear(),
        'veui-calendar-selected': (this.realSelected && !this.multiple && !this.range)
          ? year === this.realSelected.getFullYear() : false
      }
    },
    getStepLabel (view, type) {
      return this.t(`${type}${upperFirst(STEP_MAP[view])}`)
    },
    getYearOffset (i, j, isNext) {
      return isNext
        ? (i === 2 && j > 2)
          ? 6
          : (i === 3 ? 2 : 4)
        : i === 1
          ? (j < 3 ? -2 : -6)
          : -4
    },
    selectDay (day) {
      // switch month in days view if dates in previous/next months are visible
      if (this.fillMonth && this.panel === 1) {
        this.year = day.year
        this.month = day.month
      }

      let selected = new Date(day.year, day.month, day.date)
      if (!this.range) {
        if (!this.multiple) {
          // single day selection
          this.$emit('select', selected)
          return
        }

        // multiple single days selection
        let result = [...this.realSelected]
        let pos = findIndex(result, date => {
          return isSameDay(date, selected)
        })
        if (pos === -1) {
          result.push(selected)
        } else {
          result.splice(pos, 1)
        }
        this.$emit('select', result)
        return
      }

      // range selection
      if (!this.picking) {
        this.picking = [selected]
        this.$emit('selectstart', selected)
        this.markEnd(day)
        return
      }

      // prepare to select
      this.$set(this.picking, 1, selected)
      let picking = this.picking.sort((d1, d2) => d1 - d2)
      if (!this.multiple) {
        // single range selection
        this.picking = null
        this.$emit('select', [...picking])
        return
      }

      // multiple ranges selection
      this.picking = null
      let ranges = [...this.pickingRanges]
      this.pickingRanges = null
      this.$emit('select', ranges)
    },
    markEnd (day) {
      if (this.range && this.picking) {
        let marked = day ? new Date(day.year, day.month, day.date) : null
        this.$set(this.picking, 1, marked)
        if (this.multiple) {
          if (!marked) {
            this.$set(this.picking, 1, this.picking[0])
          }
          this.pickingRanges = mergeRange(this.picking, this.realSelected)
        }
        this.$emit('selectprogress', this.pickingRanges || this.picking)
      }
    },
    moveFocus (view, delta, offset = null) {
      // 不走数据流了，直接查找 DOM 元素最简单
      let selector = CELL_SELECTOR[view]
      let cells = [...this.$el.querySelectorAll(selector)]

      // 查一下当前聚焦元素的偏移量，归一化以后再处理
      if (offset === null) {
        let current = document.activeElement
        if (!current) {
          return
        }

        let pos = findIndex(cells, cell => cell === closest(current, selector))
        if (pos === -1) {
          return
        }

        offset = pos
      }

      let nextIndex = offset + delta
      let target = cells[nextIndex]

      // 如果目标格子存在，尝试 focus 一下
      // 如果已经禁用，就按方向向前/后找到最近的一个未禁用的
      if (target) {
        let button = target.querySelector('button')
        let buttons = cells.map(cell => cell.querySelector('button'))
        do {
          if (!button.disabled) {
            button.focus()
            return
          } else {
            nextIndex += sign(delta)
            button = buttons[nextIndex]
          }
        } while (button)

        // 按方向取本月目标格子均为禁用，尝试移动一天
        delta += sign(delta)
      }

      // 目标格子不在当前视图，需要翻页
      //
      // 对于月视图：
      // * 往前翻页偏移量要加入进入视图的月的天数
      // * 往后翻页偏移量要减去离开视图的月的天数
      //
      // 对于年/十年视图，直接增减 12/10 即可
      let inc = isPositive(delta)
      let year
      let month
      if (view === 'days' && inc) {
        year = this.panels[0].year
        month = this.panels[0].month
      }
      this.step(inc, view)
      if (view === 'days' && !inc) {
        year = this.panels[0].year
        month = this.panels[0].month
      }
      this.$nextTick(() => {
        let count = view === 'days'
          ? getDaysInMonth(year, month)
          : view === 'months'
            ? 12
            : 10
        this.moveFocus(view, delta, offset - sign(delta) * count)
      })
    },
    setFocus (part, index) {
      this.$nextTick(() => {
        let ref = this.$refs[part][index]
        if (ref) {
          ref.focus()
        }
      })
    },
    setView (i, value) {
      if (value) {
        this.$set(this.views, i, value)
        this.$nextTick(() => {
          focusIn(this.$refs.body[i])
        })
      } else {
        value = i
        this.views.forEach((view, i) => {
          this.$set(this.views, i, value)
        })
      }
    },
    selectMonth (i, month) {
      // yearDiff = ⌊(currentMonth + monthDiff) / 12⌋
      this.year += Math.floor((this.month + month - this.panels[i].month) / 12)
      this.month = (month - i + 12) % 12
      this.setView('days')
      this.setFocus('month-select', i)
    },
    selectYear (i, year) {
      this.year = year + Math.floor((this.panels[i].month - i) / 12)
      this.setView('days')
      this.setFocus('year-select', i)
    },
    isSelected (day) {
      if (!this.realSelected && !this.picking) {
        return false
      }
      if (!this.range) {
        if (!this.multiple) {
          // single day
          return isSameDay(this.realSelected, day)
        }
        // multiple single days
        return (this.realSelected || []).some(d => isSameDay(d, day))
      }
      if (!this.multiple) {
        // single range
        let range = this.picking || this.realSelected
        return isSameDay(range[0], day) || isSameDay(range[1], day)
      }
      // multiple ranges
      return (this.pickingRanges || this.realSelected || []).some(selected => {
        return isSameDay(selected[0], day) || isSameDay(selected[1], day)
      })
    },
    getRangePosition (day) {
      if (!this.range) {
        return false
      }

      if (!this.multiple) {
        // single range
        let range = this.realPicking || this.realSelected
        return getRangePosition(day, range)
      }

      // multiple ranges
      let ranges = this.pickingRanges || this.realSelected || []
      let position = false
      for (let i = 0, j = ranges.length; i < j; i++) {
        position = getRangePosition(day, ranges[i])
        if (position) {
          break
        }
      }
      return position
    },
    step (isNext, view) {
      let sign = isNext ? 1 : -1
      switch (view) {
        case 'days':
          let newMonth = this.month + sign
          if (newMonth === -1 || newMonth === 12) {
            this.year += sign
          }
          this.month = (newMonth + 12) % 12
          break
        case 'months':
          this.year += sign
          break
        case 'years':
          this.year += sign * 10
          break
      }
    },
    getDefaultDate () {
      return flattenDeep([this.selected])[0] || this.today
    }
  },
  watch: {
    month (val) {
      this.$emit('viewchange', {
        year: this.year,
        month: this.month
      })
    },
    selected (val) {
      this.picking = this.pickingRanges = null
    }
  }
}

function getRangePosition (day, range) {
  if (!range || !range[1]) {
    return false
  }
  let date = new Date(day.year, day.month, day.date)
  let within = (range[0] - date) * (range[1] - date) <= 0
  if (!within) {
    return false
  }
  return {
    within,
    start: range[0] - date === 0,
    end: range[1] - date === 0
  }
}
</script>
