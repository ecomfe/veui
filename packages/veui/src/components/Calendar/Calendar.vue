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
    ref="panel"
    :class="{
      [$c('calendar-panel')]: true,
      [$c(`calendar-expanded`)]: p.expanded
    }"
  >
    <div
      v-if="!isYearType"
      :class="$c('calendar-head')"
      :aria-hidden="!!pIndex"
    >
      <veui-button
        ref="backward"
        :class="{
          [$c('calendar-backward')]: true,
          [$c('calendar-visible')]: !isYearsView(p)
        }"
        :ui="uiParts.nav"
        :disabled="disabled || readonly"
        :aria-hidden="pIndex > 0"
        :aria-label="t('prevYear')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(pIndex, false, 'year')"
      >
        <veui-icon :name="icons.backward"/>
      </veui-button>
      <veui-button
        ref="prev"
        :class="{
          [$c('calendar-prev')]: true,
          [$c('calendar-visible')]: isDateType
        }"
        :ui="uiParts.nav"
        :disabled="disabled || readonly"
        :aria-hidden="pIndex > 0"
        :aria-label="t('prevMonth')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(pIndex, false, 'month')"
      >
        <veui-icon :name="icons.prev"/>
      </veui-button>
      <template>
        <veui-button
          v-if="type !== 'year'"
          :id="`${id}:panel-title:${pIndex}`"
          ref="expansion-select"
          :ui="uiParts.toggle"
          :class="{
            [$c('calendar-select')]: true,
            [$c('calendar-visible')]: true
          }"
          :disabled="disabled || readonly"
          :aria-label="selectButtonAriaLabel(p)"
          @click="setExpanded(pIndex, !p.expanded)"
        >
          <b>{{ getExpansionText(p) }}</b>
          <veui-icon :name="icons.expand"/>
        </veui-button>
        <b
          v-else
          :id="`${id}:panel-title:${pIndex}`"
          :aria-hidden="true"
          :class="$c('calendar-select')"
        >{{ t('year', { year: p.year }) }}</b>
      </template>
      <veui-button
        ref="next"
        :class="{
          [$c('calendar-next')]: true,
          [$c('calendar-visible')]: isDateType
        }"
        :ui="uiParts.nav"
        :disabled="disabled || readonly"
        :aria-label="t('nextMonth')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(pIndex, true, 'month')"
      >
        <veui-icon :name="icons.next"/>
      </veui-button>
      <veui-button
        ref="forward"
        :class="{
          [$c('calendar-forward')]: true,
          [$c('calendar-visible')]: !isYearsView(p)
        }"
        :ui="uiParts.nav"
        :disabled="disabled || readonly"
        :aria-label="t('nextYear')"
        :aria-controls="`${id}:panel-title:${pIndex}`"
        @click="step(pIndex, true, 'year')"
      >
        <veui-icon :name="icons.forward"/>
      </veui-button>
    </div>
    <div
      ref="body"
      :class="{
        [$c('calendar-body')]: true,
        [$c('calendar-multiple-range')]: multiple && range
      }"
    >
      <infinite-scroll
        v-if="isDateType && p.expanded"
        :row="150"
        :initial="panelData[pIndex].initialScrollYear"
      >
        <template slot-scope="{ onscroll, start, row, page }">
          <ul
            :ref="`yearScroller-${pIndex}`"
            :class="$c('calendar-year-scroller')"
            @scroll="onscroll"
          >
            <li
              v-for="idx in row"
              :key="idx + start - 1 + `-${page}`"
              :class="getYearClass(p, idx + start - 1)"
              :data-index="idx - 1"
            >
              <button
                type="button"
                tabindex="-1"
                @click="selectYear(pIndex, idx + start - 1)"
              >
                {{ idx + start - 1 }}
              </button>
            </li>
          </ul>
        </template>
      </infinite-scroll>
      <table
        v-if="!isYearsView(p)"
        ref="table"
        :class="{
          [$c('calendar-table')]: true,
          [$c('calendar-date-table')]: isDaysView(pIndex),
          [$c('calendar-month-table')]: isMonthsView(pIndex)
        }"
      >
        <template v-if="isDaysView(pIndex)">
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
                  @click="selectDay(pIndex, day)"
                  @mouseenter="markEnd(day)"
                  @focus="markEnd(day)"
                  @keydown.up.prevent="moveFocus(pIndex, -7)"
                  @keydown.right.prevent="moveFocus(pIndex, 1)"
                  @keydown.down.prevent="moveFocus(pIndex, 7)"
                  @keydown.left.prevent="moveFocus(pIndex, -1)"
                >
                  <slot
                    name="date"
                    v-bind="{
                      year: day.year,
                      month: day.month,
                      date: day.date
                    }"
                  >{{ day.date }}</slot>
                </button>
              </td>
            </tr>
          </tbody>
        </template>
        <tbody v-else-if="isMonthsView(pIndex)">
          <tr
            v-for="(days, row) in p.months"
            :key="row"
          >
            <td
              v-for="(day, col) in days"
              :key="col"
              :class="getMonthClass(p, day)"
            >
              <button
                :ref="day.isFocus ? 'focus' : null"
                type="button"
                :tabindex="day.isFocus ? null : '-1'"
                :disabled="
                  !p.expanded &&
                    (realDisabled || realReadonly || day.isDisabled)
                "
                @click="selectMonth(p, day)"
                @mouseenter="handleMonthMouseEnter(p, day)"
                @keydown.up.prevent="moveFocus(pIndex, -3)"
                @keydown.right.prevent="moveFocus(pIndex, 1)"
                @keydown.down.prevent="moveFocus(pIndex, 3)"
                @keydown.left.prevent="moveFocus(pIndex, -1)"
              >
                {{
                  t('month', { month: day.month + 1 }) ||
                    t(`monthsShort[${day.month}]`)
                }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <infinite-scroll
        v-else
        :row="50"
        :col="3"
        :initial="panelData[pIndex].initialScrollYear"
      >
        <template slot-scope="{ onscroll, start, row, page }">
          <div
            :ref="`yearScroller-${pIndex}`"
            :class="$c('calendar-year-table-wrap')"
            @scroll="onscroll"
          >
            <table
              ref="table"
              :class="{
                [$c('calendar-year-table')]: true,
                [$c('calendar-table')]: true
              }"
            >
              <tbody>
                <tr
                  v-for="i in row"
                  :key="`${i}-${page}`"
                >
                  <td
                    v-for="j in 3"
                    :key="j"
                    :class="getYearClass(p, start + 3 * (i - 1) + j - 1)"
                    :data-index="3 * (i - 1) + j - 1"
                  >
                    <button
                      type="button"
                      :tabindex="i === 1 && j === 1 ? null : '-1'"
                      :disabled="
                        !p.expanded &&
                          (realDisabled ||
                            realReadonly ||
                            markDisabled(start + 3 * (i - 1) + j - 1))
                      "
                      @click="selectYear(pIndex, start + 3 * (i - 1) + j - 1)"
                      @mouseenter="
                        handleYearMouseEnter(start + 3 * (i - 1) + j - 1)
                      "
                      @keydown.up.prevent="
                        moveFocus(pIndex, getYearOffset(i, j, false))
                      "
                      @keydown.right.prevent="moveFocus(pIndex, 1)"
                      @keydown.down.prevent="
                        moveFocus(pIndex, getYearOffset(i, j, true))
                      "
                      @keydown.left.prevent="moveFocus(pIndex, -1)"
                    >
                      {{ start + 3 * (i - 1) + j - 1 }}
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
  toDateData,
  isSameDay,
  isSameMonth,
  isSameYear,
  mergeRange,
  gt,
  lt
} from '../../utils/date'
import { closest, focusIn, focus, scrollToAlign } from '../../utils/dom'
import { sign, isPositive } from '../../utils/math'
import { normalizeClass } from '../../utils/helper'
import {
  isInteger,
  flattenDeep,
  findIndex,
  uniqueId,
  uniqBy,
  isEqual,
  isNumber
} from 'lodash'
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import useControllable from '../../mixins/controllable'
import i18n from '../../mixins/i18n'
import config from '../../managers/config'
import Icon from '../Icon'
import Button from '../Button'
import InfiniteScroll from '../Calendar/_InfiniteScroll'
import addMonths from 'date-fns/addMonths'

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
    'veui-button': Button,
    InfiniteScroll
  },
  mixins: [
    prefix,
    ui,
    input,
    i18n,
    useControllable({
      prop: 'selected',
      event: 'select'
    })
  ],
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
    let current = this.getDefaultDate()
    let year = current.getFullYear()
    let panelData = []
    for (let i = 0; i < this.panel; i++) {
      // panelData.date 是用来给指定普通面板（非展开面板）的时间坐标
      //  1. type=date 时为 {year, month}, 表示 day views 的当前时间坐标，而展开面板中可以设置该坐标
      //  2. type=month 时为 {year}, 表示 month views 的当前时间坐标，而展开面板中可以设置该坐标
      //  3. type=year 时无效
      let p = {
        date: { year },
        expanded: false,
        initialScrollYear: year,
        currentScrollYear: null // daysView 展开时再年份滚动面板中选中的年份
      }

      if (this.type === 'date') {
        let month = current.getMonth()
        p.date = getNextDate({ year, month }, i)
      } else if (this.type === 'month') {
        p.date.year = year + i
      }
      panelData.push(p)
    }

    return {
      panelData,
      id: uniqueId('veui-calendar-'),
      picking: null,
      pickingRanges: null,
      mousePickingStart: false,
      mergeMode: 'xor'
    }
  },
  computed: {
    realWeekStart () {
      return this.weekStart != null
        ? this.weekStart
        : config.get('calendar.weekStart')
    },
    isDateType () {
      return this.type === 'date'
    },
    isMonthType () {
      return this.type === 'month'
    },
    isYearType () {
      return this.type === 'year'
    },
    realPicking () {
      if (this.range) {
        let [from, to] = this.picking || []
        if (from && to && to - from < 0) {
          return [to, from]
        }
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
      for (let index = 0; index < panel; index++) {
        let { date, expanded, currentScrollYear } = this.panelData[index]
        let { year, month } = date
        let p = { year, index, expanded }

        if (this.isMonthType) {
          p.months = this.getMonths(year) // 普通月份面板数据源
        } else if (this.isDateType) {
          p.month = month
          p.months = this.getMonths(year, false) // 展开月份面板数据源
          p.currentScrollYear = currentScrollYear
          p.weeks = this.getWeeks(year, month)
        }
        panels.push(p)
      }
      // panels 的三种情况
      // 1. type=date 时为 {
      //   year, month, 当前普通面板时间坐标
      //   weeks, index, expanded, months,
      //   currentScrollYear } 当修改时间坐标时只选了年份，还没有选月份时的年份临时状态
      // 2. type=month 时为 {
      //   year, 当前普通面板时间坐标
      //   index, expanded, months}
      // 3. type=year 时无效
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
    selected (val) {
      this.picking = this.pickingRanges = null
      val = [].concat(val)
      if (!this.multiple && val && val[0]) {
        this.navigate(val)
      }
    }
  },
  mounted () {
    let selected = [].concat(this.realSelected)
    if (this.multiple && this.range) selected = flattenDeep(selected)
    if (selected && selected[0]) this.navigate(selected)
  },
  methods: {
    selectButtonAriaLabel (panel) {
      return this.type === 'date'
        ? this.t('selectMonth', { month: panel.month + 1 })
        : this.t('selectYear', { year: panel.year })
    },
    getDayNames () {
      let names = [...this.daysShort]
      return names.splice(this.realWeekStart - 1).concat(names)
    },
    getDayFullNames () {
      let names = [...this.daysLong]
      return names.splice(this.realWeekStart - 1).concat(names)
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
    getExpansionText (p) {
      return this.isDateType
        ? this.t('yearAndMonth', {
          year: p.year,
          month: this.t(`monthsLong[${p.month}]`) || p.month + 1
        })
        : this.t('year', { year: p.year })
    },
    isDaysView (index) {
      return this.isDateType && !this.panels[index].expanded
    },
    isMonthsView (index) {
      let expanded = this.panels[index].expanded
      return (this.isDateType && expanded) || (this.isMonthType && !expanded)
    },
    isYearsView (p) {
      return (this.isMonthType && p.expanded) || this.isYearType
    },
    getWeeks (year, month) {
      let firstDayInMonth = new Date(year, month)
      let offset = (firstDayInMonth.getDay() + 7 - this.realWeekStart) % 7
      let daysInMonth = getDaysInMonth(year, month)
      let daysInPreviousMonth = getDaysInMonth(year, month - 1)
      let weekCount = 6
      let weeks = []

      // 默认 focus 入口顺序： 选中日 -> 当天 -> 本月第一天
      let marks = {
        selectedDay: null,
        today: null,
        firstDay: null
      }

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
            weeks[i][j].isDisabled = this.markDisabled(weeks[i][j])
          } else if (i * 7 + j - offset < daysInMonth) {
            weeks[i][j] = {
              date: i * 7 + j + 1 - offset,
              month: month,
              year: year
            }
            marks = this.markDay(weeks[i][j], marks)
          } else {
            weeks[i][j] = {
              date: i * 7 + j + 1 - offset - daysInMonth,
              month: (month + 1) % 12,
              year: month === 11 ? year + 1 : year
            }
            weeks[i][j].isDisabled = this.markDisabled(weeks[i][j])
          }
        }
      }

      finalMarkDay(marks)
      return weeks
    },
    getMonths (year, mark = true) {
      let months = []
      let marks = {
        selectedDay: null,
        today: null,
        firstDay: null
      }
      for (let i = 0; i < 4; i++) {
        months[i] = months[i] || []
        for (let j = 0; j < 3; j++) {
          months[i][j] = {
            year,
            month: i * 3 + j,
            date: 1
          }
          if (mark) {
            marks = this.markDay(months[i][j], marks)
          }
        }
      }
      if (mark) finalMarkDay(marks)
      return months
    },
    markDisabled (day) {
      day = isNumber(day) ? new Date(day, 0, 1) : fromDateData(day)
      return typeof this.disabledDate === 'function'
        ? this.disabledDate(day)
        : false
    },
    markDay (day, marks) {
      day.isDisabled = this.markDisabled(day)

      day.isToday = this.isSame(day, this.today)
      day.isSelected = this.isSelected(day)
      day.rangePosition = this.getRangePosition(day)

      let { selectedDay, firstDay, today } = marks
      if (!firstDay) {
        marks.firstDay = day
      }

      // 如果本月已找到选中的日子就无需再处理了
      if (!selectedDay) {
        if (day.isSelected) {
          day.isFocus = true
          marks.selectedDay = day
        } else if (!today && day.isToday) {
          marks.today = day
        }
      }
      return marks
    },
    scrollToCurrentYear () {
      if (this.isYearType) {
        this.$nextTick(() => {
          for (let i = 0; i < this.panel; i++) {
            let container = this.$refs[`yearScroller-${i}`]
            if (container && container[0]) {
              this.scrollCurrentToCenter(container[0], 0)
            }
          }
        })
      }
    },
    isMousePicking () {
      return this.mousePickingStart
    },
    stopMousePicking () {
      if (this.mousePickingStart) {
        this.mousePickingStart = false
      }
    },
    syncPanelDate (index, dateData) {
      this.panelData[index].date = dateData
      this.$emit('viewchange', {
        ...dateData,
        index
      })
    },
    navigateByIndex (index, dateData, force = true) {
      if (this.isDateType && dateData.month == null) {
        dateData.month = this.panels[index].month
      }
      let p = this.panelData
      let same = isEqual(p[index].date, dateData)
      if (same) return

      let i = p.length
      if (!force) {
        let find = false
        while (i--) {
          if (isEqual(p[i].date, dateData)) {
            find = true
            break
          }
        }
        if (find) return
      }

      this.syncPanelDate(index, dateData)
      i = index
      while (i--) {
        if (lt(p[i].date, p[i + 1].date)) {
          break
        }
        let date = getNextDate(p[i + 1].date, -1)
        this.syncPanelDate(i, date)
      }
      for (i = index + 1; i < p.length; i++) {
        if (gt(p[i].date, p[i - 1].date)) {
          break
        }
        let date = getNextDate(p[i - 1].date)
        this.syncPanelDate(i, date)
      }
    },
    handleMonthMouseEnter (panel, day) {
      if (this.isMonthType && this.mousePickingStart) {
        this.markEnd(day)
      }
    },
    handleYearMouseEnter (year) {
      if (this.isYearType && this.mousePickingStart) {
        this.markEnd({ year: year, month: 0, date: 1 })
      }
    },
    getRangeClass (day, isYear) {
      let rangePosition = isYear
        ? this.getRangePosition(day)
        : day.rangePosition
      let { within, start, end, actionEnd, single } = rangePosition || {}
      return {
        [this.$c('calendar-in-range')]: within,
        [this.$c('calendar-range-start')]: start,
        [this.$c('calendar-range-end')]: end,
        [this.$c('calendar-action-end')]: actionEnd,
        [this.$c('calendar-range-single')]: single
      }
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
        ...this.getRangeClass(day),
        ...normalizeClass(extraClass)
      }
    },
    getMonthClass (p, day) {
      if (p.expanded) {
        day = { ...day, year: p.currentScrollYear }
      }

      let clazz = {
        [this.$c('calendar-month')]: true,
        [this.$c('calendar-today')]: day.isToday
      }
      if (this.isDateType) {
        clazz[this.$c('calendar-current')] = isSameMonth(day, p)
      } else {
        clazz = {
          ...clazz,
          ...this.getRangeClass(day),
          [this.$c('calendar-selected')]: this.isSelected(day, isSameMonth)
        }
      }
      return clazz
    },
    getYearClass (p, year) {
      let day = { year: year, month: 0, date: 1 }
      let clazz = {
        [this.$c('calendar-year')]: true,
        [this.$c('calendar-today')]: year === this.today.getFullYear()
      }
      if (this.isYearType) {
        clazz = {
          ...clazz,
          ...this.getRangeClass(day, true),
          [this.$c('calendar-selected')]: this.isSelected(day, isSameYear)
        }
      } else {
        let realYear = this.isDateType ? p.currentScrollYear : p.year
        clazz[this.$c('calendar-current')] = realYear === year
      }
      return clazz
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
    syncSelected (val) {
      this.stopMousePicking()
      this.commit('selected', val)
    },
    select (day) {
      let selected = new Date(day.year, day.month, day.date)
      if (!this.range) {
        if (this.multiple) {
          let result = this.realSelected ? [...this.realSelected] : []
          let pos = findIndex(result, date => this.isSame(date, selected))
          if (pos === -1) {
            result.push(selected)
          } else {
            result.splice(pos, 1)
          }
          return this.syncSelected(result)
        } else {
          return this.syncSelected(selected)
        }
      }

      // range selection
      if (!this.mousePickingStart) {
        // 日期上有rangePosition，月份年份直接算
        let rangPosition = day.rangePosition || this.getRangePosition(day)
        this.mergeMode = rangPosition.within ? 'substract' : 'union'
        this.picking = [selected]
        this.mousePickingStart = true
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
        this.syncSelected([...picking])
        return
      }

      // multiple ranges selection
      this.picking = null
      let ranges = [...this.pickingRanges]
      this.pickingRanges = null
      this.syncSelected(ranges)
    },
    selectDay (i, day) {
      // switch month in days view if dates in previous/next months are visible
      if (this.fillMonth && this.panel === 1) {
        this.navigateByIndex(i, {
          year: day.year,
          month: day.month
        })
      }
      return this.select(day)
    },
    selectMonth (p, day) {
      if (p.expanded) {
        day = { ...day, year: p.currentScrollYear }
      }

      if (this.isMonthType) {
        return this.select(day)
      }

      // expanded panel
      this.navigateByIndex(p.index, { year: day.year, month: day.month })
      this.setExpanded(p.index, false)
      this.setFocus('expansion-select', p.index)
    },
    selectYear (i, year) {
      if (this.isYearType) {
        return this.select({ year: year, month: 0, date: 1 })
      }

      // expanded panel
      if (!this.isDateType) {
        this.navigateByIndex(i, { year })
        this.setExpanded(i, false)
        this.setFocus('expansion-select', i)
      } else {
        this.panelData[i].currentScrollYear = year
        this.scrollCurrentToCenter(this.$refs[`yearScroller-${i}`][0])
      }
    },
    scrollCurrentToCenter (container, duration = 200) {
      this.$nextTick(() => {
        let el =
          container.querySelector(`.${this.$c('calendar-selected')}`) ||
          container.querySelector(`.${this.$c('calendar-current')}`) ||
          container.querySelector(`.${this.$c('calendar-today')}`)
        if (el) {
          scrollToAlign(container, el, {
            targetPosition: 0.5,
            viewportPosition: 0.5,
            duration
          })
          focusIn(this.isMonthType ? el : el)
        }
      })
    },
    navigateToSelected (selected) {
      // 转成 dateData
      let destinations = selected
        .sort((a, b) => a - b)
        .map(val => {
          let { year, month } = toDateData(val)
          return this.isDateType ? { year, month } : { year }
        })

      // 去掉一样的且保证不超过 panel 个数
      destinations = uniqBy(
        destinations,
        ({ year, month = 0 }) => `${year}/${month}`
      ).slice(0, this.panel)

      let p = this.panelData
      let start = 0
      let end = null

      // 得到完整的新 panelDate 数据
      let newPanelDates = destinations.reduce(
        (result, destination, index) => {
          let { year, month } = toDateData(destination)
          destination = this.isDateType ? { year, month } : { year }
          end = index - destinations.length + this.panels.length
          let existIndex = findIndex(result.slice(start, end + 1), val =>
            isEqual(val, destination)
          )
          if (existIndex >= 0) {
            start = existIndex + 1
          } else {
            // 找不到则修改 start 位置的值，然后向后调节
            result[start] = destination
            start += 1
            let pos = start
            while (pos < result.length) {
              if (gt(result[pos], result[pos - 1])) {
                break
              }
              result[pos] = getNextDate(result[pos - 1])
              pos++
            }
          }
          return result
        },
        p.map(val => val.date)
      )
      // 调节完了之后，统一 sync，避免调节过程中多余的 sync
      newPanelDates.forEach((newVal, index) => {
        if (!isEqual(newVal, p[index].date)) {
          this.syncPanelDate(index, newVal)
        }
      })
    },
    navigate (index, destination) {
      if (Array.isArray(index)) {
        this.navigateToSelected(index)
      } else if (destination && this.panels[index]) {
        let { year, month } = toDateData(destination)
        let panel = this.isDateType ? { year, month } : { year }
        this.navigateByIndex(index, panel, false)
      }
    },
    pick (value) {
      this.stopMousePicking()
      this.setExpanded(false)
      this.picking = Array.isArray(value) ? [...value] : value
    },
    markEnd (day) {
      if (this.range && this.mousePickingStart) {
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
    moveFocus (index, delta, offset = null) {
      // 不走数据流了，直接查找 DOM 元素最简单
      let view = this.isDaysView(index)
        ? 'days'
        : this.isMonthsView(index)
          ? 'months'
          : 'years'
      let selector = `.${this.$c(VIEW_CELL_CLASS_MAP[view])}`
      let cells = [...this.$refs.panel[index].querySelectorAll(selector)]

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
        year = this.panels[index].year
        month = this.panels[index].month
      }

      this.step(index, inc, this.isDateType ? 'month' : 'year')
      if (view === 'days' && !inc) {
        year = this.panels[index].year
        month = this.panels[index].month
      }
      this.$nextTick(() => {
        let count =
          view === 'days'
            ? getDaysInMonth(year, month)
            : view === 'months'
              ? 12
              : 10
        this.moveFocus(index, delta, offset - sign(delta) * count)
      })
    },
    setFocus (part, index) {
      this.$nextTick(() => {
        focus(this.$refs[part][index])
      })
    },
    setExpanded (i, value) {
      if (this.isYearType) return

      // 两个参数如 (1, true)即第二个面板进入展开状态
      if (value != null) {
        let data = this.panelData[i]
        if (this.isDateType && !data.expanded && value) {
          data.initialScrollYear = this.panels[i].year
          data.currentScrollYear = this.panels[i].year
        }
        data.expanded = value

        this.$nextTick(() => {
          if (value) {
            // todo 能去掉这个nextTick么
            return this.scrollCurrentToCenter(
              this.$refs[`yearScroller-${i}`][0],
              0
            )
          }
          focusIn(this.$refs.body[i])
        })
      } else {
        // 一个参数如（true）即所有面板进入展开状态
        value = i
        this.panelData.forEach(data => {
          data.expanded = value
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
          return isSame(this.picking || this.realSelected, day)
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
        let pos = getRangePosition(day, range, this.type)
        if (pos && this.picking && this.picking[1]) {
          pos.actionEnd = this.isSame(day, this.picking[1])
        }
        return pos
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
    step (index, isNext, type) {
      let sign = isNext ? 1 : -1
      let { year, month } = this.panels[index]
      switch (type) {
        case 'month':
          month = month + sign
          year = month === -1 || month === 12 ? year + sign : year
          month = (month + 12) % 12
          this.navigateByIndex(index, { year, month })
          break
        case 'year':
          this.navigateByIndex(index, { year: year + sign })
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
  if (!range || !range.length) {
    return false
  }

  let date = new Date(day.year, day.month, day.date)
  if (!range[0] || !range[1]) {
    return (range[0] || range[1]) - date !== 0
      ? false
      : {
        within: true,
        single: true,
        start: !!range[0],
        end: !!range[1]
      }
  }

  range = range.map(i => {
    if (i) {
      return new Date(
        i.getFullYear(),
        type === 'year' ? 0 : i.getMonth(),
        type !== 'date' ? 1 : i.getDate()
      )
    }
    return i
  })
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

function getNextDate ({ year, month }, count = 1) {
  if (month != null) {
    let date = addMonths(new Date(year, month, 1), count)
    return {
      year: date.getFullYear(),
      month: date.getMonth()
    }
  } else {
    return { year: year + count }
  }
}

function finalMarkDay ({ selectedDay, today, firstDay }) {
  // selectedDay -> today -> firstDay
  if (!selectedDay) {
    if (today) {
      today.isFocus = true
    } else if (firstDay) {
      firstDay.isFocus = true
    }
  }
}
</script>
