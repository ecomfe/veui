<template>
<div class="veui-schedule">
  <div class="veui-schedule-header">
    <slot name="header">
      <slot name="shortcuts" v-if="shortcuts && shortcuts.length">
        <div class="veui-schedule-shortcuts">
          <template v-if="shortcutsDisplay === 'expand'">
            <button v-for="({ label }, i) in shortcuts" :key="i"
              @click="selectShortcut(i)"
              :class="{
                'veui-schedule-shortcut': true,
                'veui-schedule-shortcut-selected': shortcutChecked[i]
              }">{{ label }}</button>
          </template>
          <template v-else>
            <veui-dropdown ui="link" label="默认时段" :options="shortcutOptions"
              @click="selectShortcut"></veui-dropdown>
          </template>
        </div>
      </slot>
      <slot name="legend">
        <div class="veui-schedule-legend">
          <span v-for="(status, i) in statuses" :key="i"
            class="veui-schedule-legend-item" :class="`veui-schedule-legend-${status.name}`">
            <slot name="legend-label" v-bind="status">{{ status.label }}</slot>
          </span>
        </div>
      </slot>
    </slot>
  </div>
  <div class="veui-schedule-body">
    <div class="veui-schedule-head-hour">
      <div class="veui-schedule-head-hour-item" v-for="i in 13" :key="i">{{ `${(i - 1) * 2}:00` }}</div>
    </div>
    <div class="veui-schedule-head-day">
      <div class="veui-schedule-head-day-item" v-for="i in 7" :key="i">
        <veui-checkbox ui="small" :indeterminate="dayChecked[i - 1].indeterminate"
          :checked="dayChecked[i - 1].checked" @change="toggleDay(week[i - 1], $event)">
          {{ `${dayNames[i - 1]}` }}
        </veui-checkbox>
      </div>
    </div>
    <div class="veui-schedule-detail" v-outside.mouseup="() => markEnd()">
      <table class="veui-schedule-table veui-schedule-table-interaction">
        <colgroup>
          <col v-for="i in 24" :key="i"></col>
        </colgroup>
        <tr v-for="(day, i) in hourlyStates" :key="i">
          <td v-for="(hour, j) in day" :key="j" :class="{ 'veui-schedule-selected': hour.isSelected }">
            <button :disabled="realDisabled || hour.isDisabled"
              :class="mergeClass({ 'veui-schedule-selected': hour.isSelected }, week[i], j)"
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
        <slot name="tooltip" v-bind="current">{{ currentLabel }}</slot>
      </veui-tooltip>
    </div>
  </div>
</div>
</template>

<script>
import { includes, find, isFunction, cloneDeep, mapValues, isEqual } from 'lodash'
import { input } from '../mixins'
import { merge } from '../utils/range'
import config from '../managers/config'
import { outside } from '../directives'
import { normalizeClass, keepOwn } from '../utils/helper'
import Checkbox from './Checkbox'
import Tooltip from './Tooltip'
import Dropdown from './Dropdown'

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
    'veui-tooltip': Tooltip,
    'veui-dropdown': Dropdown
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
    },
    shortcutsDisplay: {
      type: String,
      default: 'expand',
      validator (value) {
        return includes(['expand', 'collapse'], value)
      }
    },
    statuses: {
      type: Array,
      default () {
        return config.get('schedule.statuses')
      }
    }
  },
  data () {
    return {
      localSelected: cloneDeep(this.selected),
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
    dayChecked () {
      return this.week.map(day => {
        let [firstRange] = this.realSelected[day] || []
        return {
          checked: !!firstRange,
          indeterminate: firstRange && (firstRange[0] !== 0 || firstRange[1] !== 23)
        }
      })
    },
    shortcutChecked () {
      return this.realShortcuts.map(shortcut => {
        return isEqual(keepOwn(shortcut.selected), keepOwn(this.realSelected))
      })
    },
    hourlyStates () {
      return this.week.reduce((days, day) => {
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
    realSelected () {
      return this.pickingSelected || this.localSelected
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
    },
    realShortcuts () {
      return this.shortcuts.map(({ label, selected }) => {
        return {
          label,
          selected: mapValues(selected, day => day === true ? [[0, 23]] : day)
        }
      })
    },
    shortcutOptions () {
      return this.shortcuts.map(({ label }, i) => ({ label, value: i }))
    }
  },
  methods: {
    mergeClass (classes, day, hour) {
      let extra = isFunction(this.hourClass)
        ? this.hourClass(day, hour)
        : this.hourClass
      return {
        ...normalizeClass(classes),
        ...normalizeClass(extra)
      }
    },
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

        if (!selected[day] || !selected[day].length) {
          this.$delete(selected, day)
        }

        return selected
      }, cloneDeep(this.localSelected) || {})
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
        hour
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
        this.$emit('select', this.localSelected)
      }
    },
    selectShortcut (i) {
      this.localSelected = this.realShortcuts[i].selected
    },
    toggleDay (day, checked) {
      if (checked) {
        this.$set(this.localSelected, day, [[0, 23]])
      } else {
        this.$delete(this.localSelected, day)
      }
    }
  }
}

function compare (a, b) {
  return a - b
}
</script>
