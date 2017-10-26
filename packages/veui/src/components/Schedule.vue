<template>
<div class="veui-schedule">
  <div class="veui-schedule-header">

  </div>
  <div class="veui-schedule-body">
    <div class="veui-schedule-head-hour">
      <div class="veui-schedule-head-hour-item" v-for="i in 13" :key="i">{{ `${(i - 1) * 2}:00` }}</div>
    </div>
    <div class="veui-schedule-head-day">
      <div class="veui-schedule-head-day-item" v-for="i in 7" :key="i"><veui-checkbox ui="small">{{ `${dayNames[i - 1]}` }}</veui-checkbox></div>
    </div>
    <div class="veui-schedule-detail" v-outside.mouseup="() => markEnd()">
      <table class="veui-schedule-table veui-schedule-table-interaction">
        <colgroup>
          <col v-for="i in 24" :key="i"></col>
        </colgroup>
        <tr v-for="(day, i) in hourlyStates" :key="i">
          <td v-for="(hour, j) in day" :key="j" :class="{ 'veui-schedule-selected': hour.isSelected }">
            <button :disabled="realDisabled || hour.isDisabled"
              :class="{ 'veui-schedule-selected': hour.isSelected }"
              :ref="`${week[i]}-${j}`"
              @mousedown="handleMousedown(i, j)"
              @mouseenter="handleHover(i, j)"
              @mouseup="pick()"><slot name="hour" :day="week[i]" :hour="j"></slot></button>
          </td>
        </tr>
      </table>
      <table class="veui-schedule-table veui-schedule-table-selected">
        <colgroup>
          <col v-for="i in 24" :key="i"></col>
        </colgroup>
        <tr v-for="(day, i) in hourlyStates" :key="i">
          <template v-for="(hour, j) in day">
            <td v-if="!hour.isSelected || hour.isStart" :key="j"
              :colspan="hour.isStart && hour.span > 1 ? hour.span : false">
              <slot name="label" :from="hour.from" :to="hour.end">
              {{
                hour.isWhole
                  ? '全天'
                  : hour.isStart && hour.span > 2
                    ? `${hour.start}:00–${hour.end + 1}:00`
                  : ''
              }}
              </slot>
            </td>
          </template>
        </tr>
      </table>
      <veui-tooltip :target="currentRef" position="right" trigger="hover"
        :delay="0" :interactive="false" ui="small">
        <slot name="tooltip">{{ currentLabel }}</slot>
      </veui-tooltip>
    </div>
  </div>
  <div class="veui-schedule-footer">

  </div>
</div>
</template>

<script>
import { find } from 'lodash'
import { input } from '../mixins'
import { type } from '../managers'
import { merge } from '../utils/range'
import config from '../managers/config'
import { outside } from '../directives'
import Checkbox from './Checkbox'
import Tooltip from './Tooltip'

config.defaults({
  shortcuts: []
}, 'schedule')

let dayNames = [
  '一', '二', '三', '四', '五', '六', '日'
]

export default {
  name: 'veui-schedule',
  mixins: [input],
  directives: { outside },
  model: {
    prop: 'selected',
    event: 'select'
  },
  components: {
    'veui-checkbox': Checkbox,
    'veui-tooltip': Tooltip
  },
  props: {
    selected: {
      type: Object,
      default () {
        return {}
      }
    },
    hourClass: {
      type: [String, Object, Function],
      default: function () {
        return {}
      }
    },
    disabledHour: {
      type: Function,
      default: function () {
        return false
      }
    },
    shortcuts: {
      type: Array,
      default () {
        return config.get('schedule.shortcuts')
      }
    }
  },
  data () {
    return {
      localSelected: type.clone(this.selected),
      week: [1, 2, 3, 4, 5, 6, 0],
      pickingStart: null,
      pickingEnd: null,
      current: null
    }
  },
  computed: {
    dayNames () {
      return [...dayNames]
    },
    hourlyStates () {
      return [...this.week].reduce((days, day) => {
        days.push([...Array(24)].map((v, i) => i).reduce((hours, hour) => {
          hours.push({
            disabled: typeof this.disabledHour === 'function' ? this.disabledHour(day, hour) : false,
            ...this.getSelectState(day, hour)
          })
          return hours
        }, []))
        return days
      }, [])
    },
    pickingSelected () {
      if (!this.pickingStart || !this.pickingEnd) {
        return null
      }

      let dayRange = [this.pickingStart.dayIndex, this.pickingEnd.dayIndex].sort(compare)
      let hourRange = [this.pickingStart.hour, this.pickingEnd.hour].sort(compare)
      let days = [...this.week].splice(dayRange[0], dayRange[1] - dayRange[0] + 1)
      return this.mergeRange(days, hourRange)
    },
    currentRef () {
      let current = this.current
      if (!current) {
        return null
      }
      return `${current.day}-${current.hour}`
    },
    currentLabel () {
      let current = this.current
      if (!current) {
        return null
      }
      return `${current.hour}:00–${current.hour + 1}:00`
    }
  },
  methods: {
    getSelectState (day, hour) {
      let selected = this.pickingSelected || this.localSelected
      let daySelectState = selected ? selected[day] : null
      if (!daySelectState || !daySelectState.length) {
        return {
          isDisabled: this.disabledHour(day, hour),
          isSelected: false
        }
      }

      let range = find(daySelectState, ([start, end]) => {
        return hour >= start && hour <= end
      })

      return {
        isDisabled: this.disabledHour(day, hour),
        isSelected: !!range,
        ...range
          ? {
            isStart: hour === range[0],
            span: range[1] - range[0] + 1,
            start: range[0],
            end: range[1],
            isWhole: range[0] === 0 && range[1] === 23
          }
          : {}
      }
    },
    mergeRange (days, range) {
      return days.reduce((selected, day) => {
        let daySelected = selected[day]
        if (!daySelected) {
          selected[day] = [range]
        } else {
          selected[day] = merge(daySelected, range)
        }
        if (selected[day] && !selected[day].length) {
          delete selected[day]
        }

        return selected
      }, type.clone(this.localSelected) || {})
    },
    startPicking (dayIndex, hour) {
      this.pickingStart = {
        dayIndex, hour
      }
      this.pickingEnd = {
        dayIndex, hour
      }
    },
    markEnd (dayIndex, hour) {
      if (!this.pickingStart) {
        return
      }
      if (this.pickingStart && typeof dayIndex === 'undefined') {
        this.pickingStart = null
        return
      }
      this.pickingEnd = {
        dayIndex, hour
      }
    },
    updateCurrent (dayIndex, hour) {
      this.current = {
        day: this.week[dayIndex],
        hour,
        state: this.hourlyStates[dayIndex][hour]
      }
    },
    handleMousedown (dayIndex, hour) {
      this.startPicking(dayIndex, hour)
      this.updateCurrent(dayIndex, hour)
    },
    handleHover (dayIndex, hour) {
      this.markEnd(dayIndex, hour)
      this.updateCurrent(dayIndex, hour)
    },
    pick () {
      if (this.pickingStart) {
        this.localSelected = this.pickingSelected
        this.pickingStart = this.pickingEnd = null
      }
    }
  }
}

function compare (a, b) {
  return a - b
}
</script>
