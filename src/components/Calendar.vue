<template>
<div class="veui-calendar" @mouseleave="markEnd()">
  <div v-for="(p, pIndex) in panels" class="veui-calendar-panel" :class="{ [`veui-calendar-${p.view}`]: true }">
    <div class="veui-calendar-head">
      <button type="button" v-if="pIndex === 0 || p.view !== 'days'" class="veui-calendar-prev" @click="step(false, p.view)" :disabled="disabled || readonly"><veui-icon name="chevron-left"></veui-icon></button>
      <template v-if="p.view === 'days'">
        <button class="veui-calendar-select" @click="setView(pIndex, 'years')" :disabled="disabled || readonly"><b>{{ p.year }}</b> 年 <veui-icon name="caret-down"></veui-icon></button>
        <button class="veui-calendar-select" @click="setView(pIndex, 'months')" :disabled="disabled || readonly"><b>{{ p.month + 1 }}</b> 月 <veui-icon name="caret-down"></veui-icon></button>
      </template>
      <template v-if="p.view === 'months'">
        <span class="veui-calendar-label"><b>{{ p.year }}</b> 年</span>
      </template>
      <template v-if="p.view === 'years'">
        <span class="veui-calendar-label"><b>{{ p.year - p.year % 10 }}–{{ p.year - p.year % 10 + 9 }}</b> 年</span>
      </template>
      <button v-if="pIndex === panels.length - 1 || p.view !== 'days'" class="veui-calendar-next" @click="step(true, p.view)" :disabled="disabled || readonly"><veui-icon name="chevron-right"></veui-icon></button>
    </div>
    <div class="veui-calendar-body" :class="{ 'veui-calendar-multiple-range': multiple && range }">
      <table>
        <template v-if="p.view === 'days'">
          <thead>
            <tr>
              <th v-for="dayName in dayNames">{{ dayName }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="week in p.weeks">
              <td v-for="day in week"
                :key="`${day.year}-${day.month + 1}-${day.date}`"
                :class="getDateClass(day, p)">
                <button v-if="fillMonth && panel === 1 || day.month === p.month" @click="selectDay(pIndex, day)"
                  @mouseenter="markEnd(day)" @focus="markEnd(day)" :disabled="disabled || readonly || day.isDisabled">{{ day.date }}</button>
              </td>
            </tr>
          </tbody>
        </template>
        <tbody v-else-if="p.view === 'months'">
          <tr v-for="i in 3">
            <td v-for="j in 4" :class="getMonthClass(p, i, j)">
              <button @click="selectMonth(pIndex, (i - 1) * 4 + j - 1)">{{ (i - 1) * 4 + j }} 月</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="p.view === 'years'">
          <tr v-for="i in 3">
            <td v-for="j in 4" :class="getYearClass(p, i, j)">
              <button v-if="(i - 1) * 4 + j - 1 < 10" @click="selectYear(pIndex, p.year - p.year % 10 + (i - 1) * 4 + j - 1)">{{ p.year - p.year % 10 + (i - 1) * 4 + j - 1 }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <slot></slot>
</div>
</template>

<script>
import { getDaysInMonth, fromDateData, isSameDay, mergeRange } from '../utils/date'
import { flattenDeep, findIndex } from 'lodash'
import { input } from '../mixins'
import Icon from './Icon'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/caret-down'

let dayNames = [
  '一', '二', '三', '四', '五', '六', '日'
]

let monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
]

export default {
  name: 'veui-calendar',
  mixins: [input],
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
      default: 1
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
      type: [String, Object, Function],
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

    return {
      year: current.getFullYear(),
      month: current.getMonth(),
      views,
      monthNames,
      picking: null
    }
  },
  computed: {
    viewMonth () {
      return `${this.year}/${this.month}`
    },
    localSelected () {
      return this.selected ? this.selected : (this.multiple ? [] : null)
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
            day.isDisabled = this.disabledDate(fromDateData(day))
            if (day.month === month) {
              day.isToday = isSameDay(day, this.today)
              day.isSelected = this.isSelected(day)
              day.rangePosition = this.getRangePosition(day)
            }
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
    },
    dayNames () {
      let names = [...dayNames]
      return names.splice(this.weekStart - 1).concat(names)
    }
  },
  methods: {
    getDateClass (day, panel) {
      let extraClass = {}
      switch (typeof this.dateClass) {
        case 'function':
          extraClass = this.dateClass(fromDateData(day))
          break
        case 'object':
          extraClass = {
            ...this.dateClass
          }
          break
        case 'string':
          extraClass = this.dateClass
            .split(/\s+/)
            .filter(c => c)
            .reduce((result, current) => {
              result[current] = true
            }, {})
      }
      return {
        'veui-calendar-aux': day.month !== panel.month,
        'veui-calendar-today': day.isToday,
        'veui-calendar-selected': day.isSelected,
        'veui-calendar-in-range': day.rangePosition === 'within',
        'veui-calendar-range-start': day.rangePosition === 'start',
        'veui-calendar-range-end': day.rangePosition === 'end',
        ...extraClass
      }
    },
    getMonthClass (panel, i, j) {
      let month = (i - 1) * 4 + j - 1
      return {
        'veui-calendar-today': month === this.today.getMonth() && panel.year === this.today.getFullYear(),
        'veui-calendar-selected': (this.localSelected && !this.multiple && !this.range)
          ? (month === this.localSelected.getMonth() && panel.year === this.localSelected.getFullYear()) : false
      }
    },
    getYearClass (panel, i, j) {
      let year = panel.year - panel.year % 10 + (i - 1) * 4 + j - 1
      return {
        'veui-calendar-today': year === this.today.getFullYear(),
        'veui-calendar-selected': (this.localSelected && !this.multiple && !this.range)
          ? year === this.localSelected.getFullYear() : false
      }
    },
    selectDay (i, day) {
      // switch month in days view
      this.year = day.year - Math.floor((day.month - i) / 12)
      this.month = (day.month - i + 12) % 12

      let selected = new Date(day.year, day.month, day.date)
      if (!this.range) {
        if (!this.multiple) {
          this.$emit('select', selected)
          return
        }
        let result = [...this.localSelected]
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
      if (!this.picking) {
        this.picking = [selected]
        this.$emit('selectstart', selected)
        return
      }
      this.$set(this.picking, 1, selected)
      let picking = this.picking.sort((d1, d2) => d1 - d2)
      if (!this.multiple) {
        this.picking = null
        this.$emit('select', [...picking])
        return
      }
      this.picking = null
      let result = mergeRange(this.localSelected, picking)
      this.$emit('select', result)
    },
    markEnd (day) {
      if (this.range && this.picking) {
        this.$set(this.picking, 1, day ? new Date(day.year, day.month, day.date) : null)
      }
    },
    setView (i, value) {
      if (value) {
        this.$set(this.views, i, value)
      } else {
        value = i
        this.views.forEach((view, i) => {
          this.$set(this.views, i, value)
        })
      }
    },
    selectMonth (i, month) {
      this.month = (month - i + 12) % 12
      this.year += Math.floor((month - i) / 12)
      this.setView('days')
    },
    selectYear (i, year) {
      this.year = year - Math.floor((this.panels[i].month - i) / 12)
      this.setView('days')
    },
    isSelected (day) {
      if (!this.localSelected && !this.picking) {
        return false
      }
      if (!this.range) {
        if (!this.multiple) {
          return isSameDay(this.localSelected, day)
        }
        return (this.localSelected || []).some(d => isSameDay(d, day))
      }
      if (!this.multiple) {
        if (!this.picking) {
          return isSameDay(this.localSelected[0], day) || isSameDay(this.localSelected[1], day)
        }
        return isSameDay(this.picking[0], day)
      }
      return this.localSelected.some(selected => {
        return isSameDay(selected[0], day) || isSameDay(selected[1], day)
      }) || this.picking && isSameDay(this.picking[0], day)
    },
    getRangePosition (day) {
      if (!this.range) {
        return false
      }

      if (!this.multiple) {
        let range = this.picking || this.localSelected
        return getRangePosition(day, range)
      }
      let ranges = [this.picking, ...this.localSelected]
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
          this.year += sign * 12
          break
      }
    },
    getDefaultDate () {
      return flattenDeep([this.selected])[0] || this.today
    }
  },
  watch: {
    month (val, oldVal) {
      if (val !== oldVal) {
        this.$emit('viewchange', {
          year: this.year,
          month: this.month
        })
      }
    }
  }
}

function getRangePosition (day, range) {
  if (!range || !range[1]) {
    return false
  }
  let date = new Date(day.year, day.month, day.date)
  if ((range[0] - date) * (range[1] - date) < 0) {
    return 'within'
  }
  if (range[0] - date === 0) {
    return 'start'
  }
  if (range[1] - date === 0) {
    return 'end'
  }
  return false
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-calendar {
  display: inline-block;
  position: relative;
  overflow: hidden;
  border: 1px solid @veui-gray-color-sup-2;
  border-radius: 4px;
  background-color: #fff;

  &::before {
    content: "";
    position: absolute;
    top: 36px;
    left: 0;
    right: 0;
    height: 0;
    border-bottom: 1px solid @veui-gray-color-sup-2;
  }

  &-panel {
    display: inline-block;

    & + & {
      margin-left: 10px;
    }
  }

  &-body {
    border-collapse: collapse;
    table-layout: fixed;

    button {
      position: relative;
      width: 100%;
      height: 35px;
      margin-top: 1px;
      border: none;
      padding: 0;
      background-color: #fff;
      color: @veui-text-color-weak;
      text-align: center;
      outline: none;

      &:hover,
      &:focus {
        background-color: @veui-gray-color-sup-4;
      }

      &:disabled {
        &,
        &:hover {
          background-color: @veui-gray-color-sup-4;
          color: @veui-text-color-aux;
          cursor: not-allowed;
        }
      }
    }
  }

  th {
    .size(36px, 34px);
    font-weight: @veui-font-weight-normal;
    color: @veui-text-color-weak;
  }

  td {
    position: relative;
    .size(36px);
    padding: 0;
    color: @veui-text-color-normal;
  }

  th,
  td {
    text-align: center;
  }

  &-days {
    th:first-child,
    th:last-child {
      width: 38px;
    }
  }

  &-aux {
    button {
      color: @veui-text-color-aux;
    }
  }

  &-today {
    button {
      color: @veui-theme-color-primary;
      font-weight: @veui-font-weight-extra-bold;
    }
  }

  &-body&-multiple-range &-selected,
  &-in-range {
    button {
      background-color: @veui-theme-color-sup-3;
      border-radius: 0;
      color: @veui-text-color-normal;

      &:hover,
      &:focus {
        background-color: @veui-theme-color-sup-4;
      }
    }
  }

  &-selected {
    button {
      position: relative;
      color: #fff;
      background-color: @veui-theme-color-primary;
      border-radius: 2px;

      &:hover,
      &:focus {
        background-color: @veui-theme-color-hover;
      }
    }
  }

  &-range-start::after,
  &-range-end::before {
    content: "";
    position: absolute;
    top: 1px;
    bottom: 0;
    width: 2px;
    background: @veui-theme-color-sup-3;
    z-index: -1;
  }

  &-range-start::after {
    right: 0;
  }

  &-range-end::before {
    left: 0;
  }

  &-head {
    border-bottom: 1px solid @veui-gray-color-sup-2;
    text-align: center;
    color: @veui-text-color-normal;
    .clearfix();

    button {
      height: 36px;
      background: none;
      border: none;
      padding: 0 7px;
      outline: none;

      .veui-icon {
        width: 16px;
        vertical-align: middle;
        color: @veui-text-color-weak;
      }

      &:hover,
      &:focus {
        color: @veui-theme-color-primary;

        .veui-icon {
          color: @veui-theme-color-primary;
        }
      }
    }
  }

  &-label {
    line-height: 36px;
    color: @veui-theme-color-primary;
  }

  &-select {
    &:hover,
    &:focus {
      background-color: @veui-theme-color-sup-4;
    }
  }

  &-prev,
  &-next {
    width: 36px;
  }

  &-prev {
    float: left;
  }

  &-next {
    float: right;
  }

  &-months,
  &-years {
    td {
      .size(60px, 65px);

      button {
        .size(54px);
      }
    }

    .veui-calendar-body {
      margin: 5px 8px 14px;
    }
  }
}
</style>
