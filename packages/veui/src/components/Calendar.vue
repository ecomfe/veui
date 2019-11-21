<template>
<div
  :class="{
    [$c('calendar')]: true,
    [$c(`calendar-type-${type}`)]: true,
    [$c(`calendar-range`)]: range,
    [$c(`calendar-multiple`)]: multiple
  }"
  :ui="realUi"
  role="application"
  :aria-label="t('calendar')"
  :aria-disabled="realDisabled"
  :aria-readonly="realReadonly"
  @mouseleave="markEnd()"
>
  <slot name="before"/>
  <div
    v-for="(p, pIndex) in panels"
    :key="pIndex"
    :class="{
      [$c('calendar-panel')]: true,
      [$c(`calendar-expanded`)]: p.expanded
    }"
  >
    <div
      :class="$c('calendar-head')"
      :aria-hidden="pIndex > 0"
    >
      <button
        ref="doublePrev"
        type="button"
        :class="{
          [$c('calendar-double-prev')]: true,
          [$c('calendar-visible')]:
            !pIndex && (type === 'date' || (type === 'month' && !p.expanded)),
          [$c('sr-only')]:
            pIndex && (type === 'date' || (type === 'month' && !p.expanded))
        }"
        :disabled="disabled || readonly"
        :aria-hidden="pIndex > 0"
        :aria-label="t('prevYear')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(false, 'year')"
      >
        <veui-icon :name="icons.doublePrev"/>
      </button>
      <button
        ref="prev"
        type="button"
        :class="{
          [$c('calendar-prev')]: true,
          [$c('calendar-visible')]: !pIndex && type === 'date',
          [$c('sr-only')]: pIndex && type === 'date'
        }"
        :disabled="disabled || readonly"
        :aria-hidden="pIndex > 0"
        :aria-label="t('prevMonth')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(false, 'month')"
      >
        <veui-icon :name="icons.prev"/>
      </button>
      <template>
        <button
          :id="`${id}:panel-title:${pIndex}`"
          ref="expansion-select"
          type="button"
          :class="$c('calendar-select')"
          :disabled="disabled || readonly"
          :aria-label="t('selectMonth', { month: p.month + 1 })"
          @click="setExpanded(pIndex, !p.expanded)"
        >
          <b><span v-if="type === 'date'">{{
               t('month', { month: p.month + 1 }) ||
                 t(`monthsLong[${p.month}]`)
             }}</span>
            {{ t('year', { year: p.year }) }}</b>
          <veui-icon
            v-if="type !== 'year'"
            :name="icons.expand"
          />
        </button>
      </template>
      <button
        ref="doubleNext"
        type="button"
        :class="{
          [$c('calendar-double-next')]: true,
          [$c('calendar-visible')]:
            pIndex === panels.length - 1 &&
            (type === 'date' || (type === 'month' && !p.expanded)),
          [$c('sr-only')]:
            pIndex !== panels.length - 1 &&
            (type === 'date' || (type === 'month' && !p.expanded))
        }"
        :disabled="disabled || readonly"
        :aria-label="t('nextYear')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(true, 'year')"
      >
        <veui-icon :name="icons.doubleNext"/>
      </button>
      <button
        ref="next"
        type="button"
        :class="{
          [$c('calendar-next')]: true,
          [$c('calendar-visible')]:
            pIndex === panels.length - 1 && type === 'date',
          [$c('sr-only')]: pIndex !== panels.length - 1 && type === 'date'
        }"
        :disabled="disabled || readonly"
        :aria-label="t('nextMonth')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(true, 'month')"
      >
        <veui-icon :name="icons.next"/>
      </button>
    </div>
    <div
      ref="body"
      :class="{
        [$c('calendar-body')]: true,
        [$c('calendar-multiple-range')]: multiple && range
      }"
    >
      <infinite-scroll
        v-if="type === 'date' && p.expanded"
        :notable="1901"
        :row="150"
        :current="p.year"
      >
        <template slot-scope="{ listeners, data }">
          <ul
            ref="yearScroller"
            :class="$c('calendar-year-scroller')"
            v-on="listeners"
          >
            <li
              v-for="idx in data.row"
              :key="idx + data.start - 1 + `-${data.page}`"
              :class="getYearClass(p, idx + data.start - 1, true)"
            >
              <button
                type="button"
                @click="selectYear(pIndex, idx + data.start - 1)"
              >
                {{ idx + data.start - 1 }}
              </button>
            </li>
          </ul>
        </template>
      </infinite-scroll>
      <table
        v-if="!(type === 'year' || (type === 'month' && p.expanded))"
        ref="table"
        :class="{
          [$c('calendar-date-table')]: type === 'date' && !p.expanded,
          [$c('calendar-month-table')]:
            (type === 'date' && p.expanded) ||
            (type === 'month' && !p.expanded)
        }"
      >
        <template v-if="type === 'date' && !p.expanded">
          <thead>
            <tr>
              <th
                v-for="index in 7"
                :key="index"
                :aria-label="getDayFullNames()[index - 1]"
              >
                {{ getDayNames()[index - 1] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(week, index) in p.weeks"
              :key="index"
            >
              <td
                v-for="day in week"
                :key="`${day.year}-${day.month + 1}-${day.date}`"
                :class="getDateClass(day, p)"
              >
                <button
                  v-if="fillMonth || day.month === p.month"
                  :ref="day.isFocus ? 'focus' : null"
                  type="button"
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
                  @keydown.left.prevent="moveFocus(p.view, -1)"
                >
                  <slot
                    name="date"
                    v-bind="{
                      year: day.year,
                      month: day.month,
                      date: day.date
                    }"
                  >
                    {{ day.date }}
                  </slot>
                </button>
              </td>
            </tr>
          </tbody>
        </template>
        <tbody
          v-else-if="
            (type === 'date' && p.expanded) ||
              (type === 'month' && !p.expanded)
          "
        >
          <tr
            v-for="i in 4"
            :key="i"
          >
            <td
              v-for="j in 3"
              :key="j"
              :class="getMonthClass(p, i, j, type === 'date')"
            >
              <button
                type="button"
                :tabindex="i === 1 && j === 1 ? null : '-1'"
                @click="selectMonth(pIndex, (i - 1) * 3 + j - 1)"
                @mouseenter="handleMonthMouseEnter(p, i, j)"
                @keydown.up.prevent="moveFocus(p.view, -3)"
                @keydown.right.prevent="moveFocus(p.view, 1)"
                @keydown.down.prevent="moveFocus(p.view, 3)"
                @keydown.left.prevent="moveFocus(p.view, -1)"
              >
                {{
                  t('month', { month: (i - 1) * 3 + j }) ||
                    t(`monthsShort[${(i - 1) * 3 + j - 1}]`)
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <infinite-scroll
        v-else
        :notable="1901"
        :row="50"
        :col="3"
        :current="p.year"
      >
        <template slot-scope="{ listeners, data }">
          <div
            ref="yearScroller"
            :class="$c('calendar-year-table-wrap')"
            v-on="listeners"
          >
            <table
              ref="table"
              :class="$c('calendar-year-table')"
            >
              <tbody>
                <tr
                  v-for="i in data.row"
                  :key="`${i}-${data.page}`"
                >
                  <td
                    v-for="j in 3"
                    :key="j"
                    :class="
                      getYearClass(
                        p,
                        data.start + 3 * (i - 1) + j - 1,
                        type === 'month'
                      )
                    "
                  >
                    <button
                      type="button"
                      :tabindex="i === 1 && j === 1 ? null : '-1'"
                      @click="
                        selectYear(pIndex, data.start + 3 * (i - 1) + j - 1)
                      "
                      @mouseenter="
                        handleYearMouseEnter(data.start + 3 * (i - 1) + j - 1)
                      "
                      @keydown.up.prevent="
                        moveFocus(p.view, getYearOffset(i, j, false))
                      "
                      @keydown.right.prevent="moveFocus(p.view, 1)"
                      @keydown.down.prevent="
                        moveFocus(p.view, getYearOffset(i, j, true))
                      "
                      @keydown.left.prevent="moveFocus(p.view, -1)"
                    >
                      {{ data.start + 3 * (i - 1) + j - 1 }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </infinite-scroll>
    </div>
  </div>
  <slot name="after"/>
</div>
</template>

<script>
import {
  getDaysInMonth,
  fromDateData,
  isSameDay,
  isSameMonth,
  isSameYear,
  mergeRange
} from '../utils/date'
import { closest, focusIn, focus, scrollTo } from '../utils/dom'
import { sign, isPositive } from '../utils/math'
import { normalizeClass } from '../utils/helper'
import { isInteger, flattenDeep, findIndex, uniqueId } from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import config from '../managers/config'
import Icon from './Icon'
import InfiniteScroll from './Calendar/_InfiniteScroll'

config.defaults({
  'calendar.weekStart': 1
})

const VIEW_CELL_CLASS_MAP = {
  days: 'calendar-day',
  months: 'calendar-month',
  years: 'calendar-year'
}

export default {
  name: 'veui-calendar',
  components: {
    'veui-icon': Icon,
    InfiniteScroll
  },
  mixins: [prefix, ui, input, i18n],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    type: {
      type: String,
      default: 'date',
      validator (val) {
        return ['date', 'month', 'year'].indexOf(val) !== -1
      }
    },
    panel: {
      type: Number,
      default: 1,
      validator (val) {
        return isInteger(val) && val > 0
      }
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
    let expands = []
    for (let i = 0; i < this.panel; i++) {
      expands[i] = false
    }

    let current = this.getDefaultDate()

    let id = uniqueId('veui-calendar-')

    return {
      // panel 显示的基准
      year: current.getFullYear(),
      month: current.getMonth(),
      expands,
      id,
      picking: null,
      pickingRanges: null,
      mergeMode: 'xor'
    }
  },
  computed: {
    realWeekStart () {
      return this.weekStart != null
        ? this.weekStart
        : config.get('calendar.weekStart')
    },
    viewMonth () {
      return `${this.year}/${this.month}`
    },
    realSelected () {
      return this.selected ? this.selected : this.multiple ? [] : null
    },
    realPicking () {
      let [from, to] = this.picking || []
      if (to && to - from < 0) {
        return [to, from]
      }
      return this.picking
    },
    isSame () {
      return {
        year: isSameYear,
        month: isSameMonth,
        date: isSameDay
      }[this.type]
    },
    panels () {
      let panel = this.panel

      let panels = []
      for (let i = 0; i < panel; i++) {
        let year = this.year + Math.floor((this.month + i) / 12)
        let month = (this.month + i) % 12
        let expanded = this.expands[i]
        if (this.type !== 'date') {
          panels.push({
            year,
            month,
            expanded
          })
          continue
        }

        let firstDayInMonth = new Date(year, month)
        let offset = (firstDayInMonth.getDay() + 7 - this.realWeekStart) % 7
        let daysInMonth = getDaysInMonth(year, month)
        let daysInPreviousMonth = getDaysInMonth(year, month - 1)
        // let weekCount = Math.ceil((offset + daysInMonth) / 7)
        let weekCount = 6
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
            day.isDisabled =
              typeof this.disabledDate === 'function'
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
          expanded
        })
      }
      return panels
    },
    daysShort () {
      return this.t('daysShort')
    },
    daysLong () {
      return this.t('daysLong')
    }
  },
  watch: {
    viewMonth (val) {
      this.$emit('viewchange', {
        year: this.year,
        month: this.month
      })
    },
    selected (val) {
      this.picking = this.pickingRanges = null
    }
  },
  methods: {
    getDayNames () {
      let names = [...this.daysShort]
      return names.splice(this.realWeekStart - 1).concat(names)
    },
    getDayFullNames () {
      let names = [...this.daysLong]
      return names.splice(this.realWeekStart - 1).concat(names)
    },
    handleMonthMouseEnter (panel, i, j) {
      if (this.type === 'month') {
        let month = (i - 1) * 3 + j - 1
        let day = {
          year: panel.year,
          month,
          date: 1
        }
        this.markEnd(day)
      }
    },
    handleYearMouseEnter (year) {
      if (this.type === 'year') {
        let day = {
          year: year,
          month: 0,
          date: 1
        }
        this.markEnd(day)
      }
    },
    getLocaleString (day) {
      let { year, month, date } = day
      let d = fromDateData(day)
      return this.t('dateLabel', {
        year: this.t('year', { year }),
        month:
          this.t('month', { month: month + 1 }) ||
          this.t(`monthsLong[${month}]`),
        date: this.t('date', { date }),
        day: this.t(`daysLong[${d.getDay()}]`)
      })
    },
    getDateClass (day, panel) {
      let extraClass =
        typeof this.dateClass === 'function'
          ? this.dateClass(fromDateData(day))
          : this.dateClass

      return {
        [this.$c('calendar-day')]: day.month === panel.month,
        [this.$c('calendar-aux')]: day.month !== panel.month,
        [this.$c('calendar-today')]: day.isToday,
        [this.$c('calendar-selected')]: day.isSelected,
        [this.$c('calendar-in-range')]:
          day.rangePosition && day.rangePosition.within,
        [this.$c('calendar-range-start')]:
          day.rangePosition && day.rangePosition.start,
        [this.$c('calendar-range-end')]:
          day.rangePosition && day.rangePosition.end,
        ...normalizeClass(extraClass)
      }
    },
    getRangeClass (day) {
      let rangePosition = this.getRangePosition(day)
      return {
        [this.$c('calendar-in-range')]: rangePosition && rangePosition.within,
        [this.$c('calendar-range-start')]: rangePosition && rangePosition.start,
        [this.$c('calendar-range-end')]: rangePosition && rangePosition.end
      }
    },
    getMonthClass (p, i, j, ignoreRange) {
      let month = (i - 1) * 3 + j - 1
      let day = {
        year: p.year,
        month,
        date: 1
      }
      let clazz = {
        [this.$c('calendar-month')]: true,
        [this.$c('calendar-today')]:
          month === this.today.getMonth() &&
          p.year === this.today.getFullYear(),
        [this.$c('calendar-selected')]: this.isSelected(day, isSameMonth)
      }
      return ignoreRange
        ? clazz
        : {
          ...clazz,
          ...this.getRangeClass(day)
        }
    },
    getYearClass (p, year, ignoreRange) {
      let day = {
        year: year,
        month: 0,
        date: 1
      }
      let clazz = {
        [this.$c('calendar-year')]: true,
        [this.$c('calendar-current')]: p.year === year,
        [this.$c('calendar-selected')]: this.isSelected(day, isSameYear),
        [this.$c('calendar-today')]: year === this.today.getFullYear()
      }
      return ignoreRange
        ? clazz
        : {
          ...clazz,
          ...this.getRangeClass(day)
        }
    },
    getYearOffset (i, j, isNext) {
      return isNext
        ? i === 2 && j > 2
          ? 6
          : i === 3
            ? 2
            : 4
        : i === 1
          ? j < 3
            ? -2
            : -6
          : -4
    },
    commonSelect (day) {
      let selected = new Date(day.year, day.month, day.date)
      if (!this.range) {
        if (this.multiple) {
          let result = [...this.realSelected]
          let pos = findIndex(result, date => this.isSame(date, selected))
          if (pos === -1) {
            result.push(selected)
          } else {
            result.splice(pos, 1)
          }
          return this.$emit('select', result)
        } else {
          return this.$emit('select', selected)
        }
      }

      // range selection
      if (!this.picking) {
        // 日期上有rangePosition，月份年份直接算
        let rangPosition = day.rangePosition || this.getRangePosition(day)
        this.mergeMode = rangPosition.within ? 'substract' : 'union'
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
    selectDay (day) {
      // switch month in days view if dates in previous/next months are visible
      if (this.fillMonth && this.panel === 1) {
        this.year = day.year
        this.month = day.month
      }
      return this.commonSelect(day)
    },
    selectMonth (i, month) {
      if (this.type === 'month') {
        return this.commonSelect({
          year: this.year,
          month,
          date: 1
        })
      }

      // type === date 的视图修改
      // yearDiff = ⌊(currentMonth + monthDiff) / 12⌋
      this.year += Math.floor((this.month + month - this.panels[i].month) / 12)
      this.month = (month - i + 12) % 12
      this.setExpanded(false)
      this.setFocus('expansion-select', i)
    },
    selectYear (i, year) {
      if (this.type === 'year') {
        return this.commonSelect({
          year: year,
          month: 0,
          date: 1
        })
      }
      this.year = year + Math.floor((this.panels[i].month - i) / 12)
      this.setExpanded(false)
      this.setFocus('expansion-select', i)
    },
    markEnd (day) {
      if (this.range && this.picking) {
        let marked = day ? new Date(day.year, day.month, day.date) : null
        this.$set(this.picking, 1, marked)
        if (this.multiple) {
          if (!marked) {
            this.$set(this.picking, 1, this.picking[0])
          }
          this.pickingRanges = mergeRange(
            this.realSelected || [],
            this.picking || [],
            this.type,
            this.mergeMode
          )
        }
        this.$emit('selectprogress', this.pickingRanges || this.picking)
      }
    },
    moveFocus (view, delta, offset = null) {
      // 不走数据流了，直接查找 DOM 元素最简单
      let selector = `.${this.$c(VIEW_CELL_CLASS_MAP[view])}`
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
        let count =
          view === 'days'
            ? getDaysInMonth(year, month)
            : view === 'months'
              ? 12
              : 10
        this.moveFocus(view, delta, offset - sign(delta) * count)
      })
    },
    setFocus (part, index) {
      this.$nextTick(() => {
        focus(this.$refs[part][index])
      })
    },
    setExpanded (i, value) {
      if (this.type === 'year') {
        return
      }

      if (value != null) {
        this.$set(this.expands, i, value)
        this.$nextTick(() => {
          if (value) {
            // todo 能去掉这个nextTick么
            return this.$nextTick(() => {
              let container = this.$refs.yearScroller[0]
              let el = container.querySelector(
                `.${this.$c('calendar-current')}`
              )
              if (el) {
                scrollTo(0.5, container, el, {
                  duration: 0
                })
                focusIn(this.type === 'month' ? el : el)
              }
            })
          }
          focusIn(this.$refs.body[i])
        })
      } else {
        value = i
        this.expands.forEach((view, i) => {
          this.$set(this.expands, i, value)
        })
      }
    },
    isSelected (day, isSame) {
      if (!this.realSelected && !this.picking) {
        return false
      }
      isSame = isSame || this.isSame

      if (!this.range) {
        if (!this.multiple) {
          // single day
          return isSame(this.realSelected, day)
        }
        // multiple single days
        return (this.realSelected || []).some(d => isSame(d, day))
      }
      if (!this.multiple) {
        // single range
        let range = this.picking || this.realSelected
        return isSame(range[0], day) || isSame(range[1], day)
      }
      // multiple ranges
      return (this.pickingRanges || this.realSelected || []).some(selected => {
        return isSame(selected[0], day) || isSame(selected[1], day)
      })
    },
    getRangePosition (day) {
      if (!this.range) {
        return false
      }

      if (!this.multiple) {
        // single range
        let range = this.realPicking || this.realSelected
        return getRangePosition(day, range, this.type)
      }

      // multiple ranges
      let ranges = this.pickingRanges || this.realSelected || []
      let position = false
      for (let i = 0, j = ranges.length; i < j; i++) {
        position = getRangePosition(day, ranges[i], this.type)
        if (position) {
          break
        }
      }
      return position
    },
    step (isNext, type) {
      let sign = isNext ? 1 : -1
      switch (type) {
        case 'month':
          let newMonth = this.month + sign
          if (newMonth === -1 || newMonth === 12) {
            this.year += sign
          }
          this.month = (newMonth + 12) % 12
          break
        case 'year':
          this.year += sign
          break
      }
    },
    getDefaultDate () {
      return flattenDeep([this.selected])[0] || this.today
    },
    focus () {
      focus(this.$refs.focus && this.$refs.focus[0])
    }
  }
}

function getRangePosition (day, range, type) {
  if (!range || !range[1]) {
    return false
  }
  let date = new Date(day.year, day.month, day.date)
  if (type !== 'date') {
    range = range.map(i => {
      let copy = new Date(i.getTime())
      copy.setDate(1)
      if (type === 'year') {
        copy.setMonth(0)
      }
      return copy
    })
  }
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
