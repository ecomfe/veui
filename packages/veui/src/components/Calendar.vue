<template>
<div class="veui-calendar" @mouseleave="markEnd()">
  <slot name="before"></slot>
  <div v-for="(p, pIndex) in panels" :key="pIndex" class="veui-calendar-panel" :class="{ [`veui-calendar-${p.view}`]: true }">
    <div class="veui-calendar-head">
      <button type="button" v-if="pIndex === 0 || p.view !== 'days'" class="veui-calendar-prev" @click="step(false, p.view)" :disabled="disabled || readonly"><veui-icon :name="icons.prev"></veui-icon></button>
      <template v-if="p.view === 'days'">
        <button type="button" class="veui-calendar-select" @click="setView(pIndex, 'years')" :disabled="disabled || readonly"><b>{{ p.year }}</b> 年 <veui-icon :name="icons.expand"></veui-icon></button>
        <button type="button" class="veui-calendar-select" @click="setView(pIndex, 'months')" :disabled="disabled || readonly"><b>{{ p.month + 1 }}</b> 月 <veui-icon :name="icons.expand"></veui-icon></button>
      </template>
      <template v-if="p.view === 'months'">
        <span class="veui-calendar-label"><b>{{ p.year }}</b> 年</span>
      </template>
      <template v-if="p.view === 'years'">
        <span class="veui-calendar-label"><b>{{ p.year - p.year % 10 }}–{{ p.year - p.year % 10 + 9 }}</b> 年</span>
      </template>
      <button type="button" v-if="pIndex === panels.length - 1 || p.view !== 'days'" class="veui-calendar-next" @click="step(true, p.view)" :disabled="disabled || readonly"><veui-icon :name="icons.next"></veui-icon></button>
    </div>
    <div class="veui-calendar-body" :class="{ 'veui-calendar-multiple-range': multiple && range }">
      <table>
        <template v-if="p.view === 'days'">
          <thead>
            <tr>
              <th v-for="dayName in dayNames" :key="dayName">{{ dayName }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, index) in p.weeks" :key="index">
              <td v-for="day in week"
                :key="`${day.year}-${day.month + 1}-${day.date}`"
                :class="getDateClass(day, p)">
                <button type="button" v-if="fillMonth && panel === 1 || day.month === p.month" @click="selectDay(pIndex, day)"
                  @mouseenter="markEnd(day)" @focus="markEnd(day)" :disabled="realDisabled || realReadonly || day.isDisabled">{{ day.date }}</button>
              </td>
            </tr>
          </tbody>
        </template>
        <tbody v-else-if="p.view === 'months'">
          <tr v-for="i in 3" :key="i">
            <td v-for="j in 4" :class="getMonthClass(p, i, j)" :key="j">
              <button type="button" @click="selectMonth(pIndex, (i - 1) * 4 + j - 1)">{{ (i - 1) * 4 + j }} 月</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="p.view === 'years'">
          <tr v-for="i in 3" :key="i">
            <td v-for="j in 4" :class="getYearClass(p, i, j)" :key="j">
              <button type="button" v-if="(i - 1) * 4 + j - 1 < 10" @click="selectYear(pIndex, p.year - p.year % 10 + (i - 1) * 4 + j - 1)">{{ p.year - p.year % 10 + (i - 1) * 4 + j - 1 }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <slot name="after"></slot>
</div>
</template>

<script>
import { getDaysInMonth, fromDateData, isSameDay, mergeRange } from '../utils/date'
import { flattenDeep, findIndex } from 'lodash'
import { input, icons } from '../mixins'
import config from '../managers/config'
import Icon from './Icon'

config.defaults({
  'calendar.weekStart': 1
})

let dayNames = [
  '一', '二', '三', '四', '五', '六', '日'
]

let monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
]

export default {
  name: 'veui-calendar',
  mixins: [input, icons],
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
      validate (val) {
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
      picking: null,
      pickingRanges: null
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
          // single day selection
          this.$emit('select', selected)
          return
        }

        // multiple single days selection
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

      // range selection
      if (!this.picking) {
        this.picking = [selected]
        this.$emit('selectstart', this.picking)
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
          this.pickingRanges = mergeRange(this.picking, this.localSelected)
        }
        this.$emit('selectprogress', this.pickingRanges || this.picking)
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
          // single day
          return isSameDay(this.localSelected, day)
        }
        // multiple single days
        return (this.localSelected || []).some(d => isSameDay(d, day))
      }
      if (!this.multiple) {
        // single range
        let range = this.picking || this.localSelected
        return isSameDay(range[0], day) || isSameDay(range[1], day)
      }
      // multiple ranges
      return (this.pickingRanges || this.localSelected || []).some(selected => {
        return isSameDay(selected[0], day) || isSameDay(selected[1], day)
      })
    },
    getRangePosition (day) {
      if (!this.range) {
        return false
      }

      if (!this.multiple) {
        // single range
        let range = this.picking || this.localSelected
        return getRangePosition(day, range)
      }

      // multiple ranges
      let ranges = this.pickingRanges || this.localSelected || []
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
