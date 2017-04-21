<template>
<div class="veui-calendar">
  <div v-for="(p, pIndex) in panels" class="veui-calendar-panel" :class="{ [`veui-calendar-${p.view}`]: true }">
    <div class="veui-calendar-head">
      <button v-if="pIndex === 0 || p.view !== 'days'" class="veui-calendar-prev" @click="step(false, p.view)"><veui-icon name="chevron-left"></veui-icon></button>
      <template v-if="p.view === 'days'">
        <button class="veui-calendar-select" @click="setView(pIndex, 'years')"><b>{{ p.year }}</b> 年 <veui-icon name="caret-down"></veui-icon></button>
        <button class="veui-calendar-select" @click="setView(pIndex, 'months')"><b>{{ p.month + 1 }}</b> 月 <veui-icon name="caret-down"></veui-icon></button>
      </template>
      <template v-if="p.view === 'months'">
        <span class="veui-calendar-label"><b>{{ p.year }}</b> 年</span>
      </template>
      <template v-if="p.view === 'years'">
        <span class="veui-calendar-label"><b>{{ p.year - 6 }}–{{ p.year + 5 }}</b> 年</span>
      </template>
      <button v-if="pIndex === panels.length - 1 || p.view !== 'days'" class="veui-calendar-next" @click="step(true, p.view)"><veui-icon name="chevron-right"></veui-icon></button>
    </div>
    <div class="veui-calendar-body" @mouseleave="markEnd()">
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
                :class="{
                  'veui-calendar-aux': day.month !== p.month,
                  'veui-calendar-today': day.isToday,
                  'veui-calendar-selected': day.isSelected,
                  'veui-calendar-in-range': day.isInRange,
                  'veui-calendar-range-start': day.isRangeStart,
                  'veui-calendar-range-end': day.isRangeEnd
                }">
                <button v-if="fillMonth && panel === 1 || day.month === p.month" @click="selectDay(pIndex, day)"
                  @mouseenter="markEnd(day)" @focus="markEnd(day)">{{ day.date }}</button>
              </td>
            </tr>
          </tbody>
        </template>
        <tbody v-else-if="p.view === 'months'">
          <tr v-for="i in 3">
            <td v-for="j in 4" :class="{
              'veui-calendar-today': (i - 1) * 4 + j - 1 === today.getMonth() && p.year === today.getFullYear(),
              'veui-calendar-selected': (localSelected && !multiple && !range) ?
                ((i - 1) * 4 + j - 1 === localSelected.getMonth() && p.year === localSelected.getFullYear()) : false
            }">
              <button @click="selectMonth(pIndex, (i - 1) * 4 + j - 1)">{{ (i - 1) * 4 + j }} 月</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="p.view === 'years'">
          <tr v-for="i in 3">
            <td v-for="j in 4" :class="{
              'veui-calendar-today': p.year + (i - 1) * 4 + j - 7 === today.getFullYear()
            }">
              <button @click="selectYear(pIndex, p.year + (i - 1) * 4 + j - 7)">{{ p.year + (i - 1) * 4 + j - 7 }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import { getDaysInMonth, isSameDay } from '../utils/date'
import { findIndex } from 'lodash'
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
            if (day.month === month) {
              day.isToday = isSameDay(day, this.today)
              day.isSelected = this.isSelected(day)
              let position = this.getRangePosition(day)
              day.isInRange = position === true
              day.isRangeStart = position === 'start'
              day.isRangeEnd = position === 'end'
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
    selectDay (i, day) {
      // switch month in days view
      this.year = day.year - Math.floor((day.month - i) / 12)
      this.month = (day.month - i + 12) % 12

      let selected = new Date(day.year, day.month, day.date)
      if (!this.range) {
        if (!this.multiple) {
          this.$emit('select', selected)
          this.$emit('update:selected', selected)
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
        this.$emit('update:selected', result)
        return
      }
      if (!this.multiple) {
        if (!this.picking) {
          this.picking = [selected]
          return
        }
        this.$set(this.picking, 1, selected)
        let result = [...this.picking.sort((d1, d2) => d1 - d2)]
        this.picking = null
        this.$emit('select', result)
        this.$emit('update:selected', result)
      }
    },
    markEnd (day) {
      if (this.range && this.picking) {
        if (day) {
          this.$set(this.picking, 1, new Date(day.year, day.month, day.date))
        } else {
          this.picking.splice(1)
        }
      }
    },
    setView (i, view) {
      this.$set(this.views, i, view)
    },
    selectMonth (i, month) {
      this.month = (month - i + 12) % 12
      this.year += Math.floor((month - i) / 12)
      this.$set(this.views, i, 'days')
    },
    selectYear (i, year) {
      this.year = year - Math.floor((this.panels[i].month - i) / 12)
      this.$set(this.views, i, 'days')
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
          return isSameDay(this.localSelected[0], day) || isSameDay(day, this.localSelected[1])
        }
        return isSameDay(this.picking[0], day)
      }
    },
    getRangePosition (day) {
      if (!this.range) {
        return false
      }
      if (!this.multiple) {
        let range = this.picking || this.localSelected
        if (!range || !range[1]) {
          return false
        }
        let date = new Date(day.year, day.month, day.date)
        if ((range[0] - date) * (range[1] - date) < 0) {
          return true
        }
        if (range[0] - date === 0) {
          return 'start'
        }
        if (range[1] - date === 0) {
          return 'end'
        }
        return false
      }
      return false
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
      let current = this.today
      if (this.localSelected) {
        if (this.localSelected instanceof Date) {
          current = this.localSelected
        } else {
          current = this.localSelected[0]
        }
      }
      return current
    }
  }
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

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 37px;
    border-bottom: 1px solid @veui-gray-color-sup-2;
    z-index: -1;
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
      height: 100%;
      border: none;
      padding: 0;
      background-color: #fff;
      text-align: center;
      outline: none;

      &:hover,
      &:focus {
        background-color: @veui-gray-color-sup-4;
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

  &-selected {
    button {
      position: relative;
      color: #fff;
      background-color: @veui-theme-color-primary;
      border-radius: 2px;

      &:hover,
      &:focus {
        background-color: @veui-theme-color-secondary;
      }
    }
  }

  &-in-range {
    button {
      border-radius: 2px;
      background-color: @veui-theme-color-sup-3;
      border-radius: 0;

      &:hover,
      &:focus {
        background-color: @veui-theme-color-sup-4;
      }
    }
  }

  &-range-start::after,
  &-range-end::before {
    content: "";
    position: absolute;
    top: 0;
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

      .fa-icon {
        vertical-align: middle;
        color: @veui-text-color-weak;
      }

      &:hover,
      &:focus {
        color: @veui-theme-color-primary;

        .fa-icon {
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
