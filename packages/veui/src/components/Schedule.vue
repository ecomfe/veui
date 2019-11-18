<template>
<div
  :class="$c('schedule')"
  :ui="realUi"
  role="application"
  :aria-label="t('schedule')"
  :aria-disabled="realDisabled"
  :aria-readonly="realReadonly"
  tabindex="-1"
>
  <slot name="header">
    <div :class="$c('schedule-header')">
      <slot name="header-content">
        <slot
          v-if="shortcuts && shortcuts.length"
          name="shortcuts"
        >
          <div :class="$c('schedule-shortcuts')">
            <template v-if="shortcutsDisplay === 'inline'">
              <button
                v-for="({ label }, i) in shortcuts"
                :key="i"
                type="button"
                :class="{
                  'veui-schedule-shortcut': true,
                  'veui-schedule-shortcut-selected': shortcutChecked[i]
                }"
                :disabled="realDisabled || realReadonly"
                @click="selectShortcut(i)"
              >
                {{ label }}
              </button>
            </template>
            <template v-else>
              <veui-dropdown
                :ui="uiParts.shortcuts"
                :label="t('preset')"
                :aria-label="t('selectPreset')"
                :options="shortcutOptions"
                :disabled="realDisabled || realReadonly"
                @click="selectShortcut"
              />
            </template>
          </div>
        </slot>
        <slot name="legend">
          <div
            :class="$c('schedule-legend')"
            aria-hidden="true"
          >
            <span
              v-for="(status, i) in realStatuses"
              :key="i"
              :class="[
                $c('schedule-legend-item'),
                $c(`schedule-legend-${status.value || status.name}`)
              ]"
            >
              <slot
                name="legend-label"
                v-bind="status"
              >
                {{ status.label }}
              </slot>
            </span>
          </div>
        </slot>
      </slot>
    </div>
  </slot>
  <div :class="$c('schedule-body')">
    <div :class="$c('schedule-head-hour')">
      <div
        v-for="i in 13"
        :key="i"
        :class="$c('schedule-head-hour-item')"
      >
        {{ `${(i - 1) * 2}:00` }}
      </div>
    </div>
    <div :class="$c('schedule-head-day')">
      <div
        v-for="i in 7"
        :key="i"
        :class="$c('schedule-head-day-item')"
      >
        <veui-checkbox
          :ui="uiParts.dayPicker"
          :indeterminate="dayChecked[i - 1].indeterminate"
          :checked="dayChecked[i - 1].checked"
          :aria-label="getDayLabel(i - 1)"
          :disabled="realDisabled || realReadonly"
          @change="toggleDay(week[i - 1], !dayChecked[i - 1].checked)"
        >
          {{ dayNames[i - 1] }}
        </veui-checkbox>
      </div>
    </div>
    <div
      v-outside.mouseup="() => markEnd()"
      :class="$c('schedule-detail')"
    >
      <table
        :class="[$c('schedule-table'), $c('schedule-table-interaction')]"
      >
        <colgroup>
          <col
            v-for="i in 24"
            :key="i"
          >
        </colgroup>
        <tr
          v-for="(day, i) in hourlyStates"
          :key="i"
        >
          <td
            v-for="(hour, j) in day"
            :key="j"
            :class="{
              [$c('schedule-selected')]: hour.isSelected
            }"
          >
            <button
              :ref="`hour-${week[i]}-${j}`"
              type="button"
              :disabled="realDisabled || realReadonly || hour.isDisabled"
              :class="
                mergeClass(
                  { [$c('schedule-selected')]: hour.isSelected },
                  week[i],
                  j
                )
              "
              :tabindex="i === 0 && j === 0 ? '0' : '-1'"
              :aria-label="getHourLabel(i, j, hour)"
              @mousedown="handleMousedown(i, j)"
              @mouseenter="handleHover(i, j)"
              @mouseup="pick"
              @keydown.space.enter="handleMousedown(i, j)"
              @keyup.space.enter="pick"
              @keydown.up.prevent="moveFocus((i + 6) % 7, j)"
              @keydown.right.prevent="moveFocus(i, (j + 25) % 24)"
              @keydown.down.prevent="moveFocus((i + 1) % 7, j)"
              @keydown.left.prevent="moveFocus(i, (j + 23) % 24)"
            >
              <slot
                name="hour"
                :day="week[i]"
                :hour="j"
              />
            </button>
          </td>
        </tr>
      </table>

      <table :class="[$c('schedule-table'), $c('schedule-table-selected')]">
        <colgroup>
          <col
            v-for="i in 24"
            :key="i"
          >
        </colgroup>
        <tr
          v-for="(day, i) in hourlyStates"
          :key="i"
        >
          <template v-for="(hour, j) in day">
            <td
              v-if="!hour.isSelected || hour.isStart"
              :key="j"
              :colspan="hour.isStart && hour.span > 1 ? hour.span : false"
            >
              <slot
                name="label"
                :from="hour.start"
                :to="hour.end"
              >
                {{
                  hour.isWhole
                    ? t('entireDay')
                    : hour.isStart && hour.span > 2
                      ? `${hour.start}:00–${hour.end + 1}:00`
                      : ''
                }}
              </slot>
            </td>
          </template>
        </tr>
      </table>

      <veui-tooltip
        :target="currentRef"
        position="right"
        trigger="hover"
        :delay="0"
        :interactive="false"
        :ui="uiParts.tooltip"
        open
      >
        <slot
          name="tooltip"
          v-bind="current"
        >
          {{ currentLabel }}
        </slot>
      </veui-tooltip>
    </div>
  </div>
</div>
</template>

<script>
import {
  includes,
  find,
  isFunction,
  cloneDeep,
  mapValues,
  isEqual
} from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import input from '../mixins/input'
import i18n from '../mixins/i18n'
import outside from '../directives/outside'
import { merge } from '../utils/range'
import config from '../managers/config'
import { normalizeClass } from '../utils/helper'
import Checkbox from './Checkbox'
import Tooltip from './Tooltip'
import Dropdown from './Dropdown'

config.defaults(
  {
    statuses: [
      { name: 'selected', label: '@@schedule.selectedRanges' },
      { name: 'available', label: '@@schedule.availableRanges' }
    ],
    shortcuts: []
  },
  'schedule'
)

export default {
  name: 'veui-schedule',
  directives: { outside },
  components: {
    'veui-checkbox': Checkbox,
    'veui-tooltip': Tooltip,
    'veui-dropdown': Dropdown
  },
  mixins: [prefix, ui, input, i18n],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    selected: {
      type: Object,
      default () {
        return {}
      }
    },
    hourClass: {
      type: [String, Array, Object, Function],
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
    shortcuts: Array,
    shortcutsDisplay: {
      type: String,
      default: 'inline',
      validator (value) {
        return includes(['inline', 'popup'], value)
      }
    },
    statuses: Array
  },
  data () {
    return {
      localSelected: null,
      week: [1, 2, 3, 4, 5, 6, 0],
      pickingStart: null,
      pickingEnd: null,
      current: null,
      mergeMode: 'xor'
    }
  },
  computed: {
    realStatuses () {
      return this.statuses || config.get('schedule.statuses')
    },
    dayNames () {
      return [...this.t('daysAbbr')]
    },
    dayChecked () {
      return this.week.map(day => {
        let [firstRange] = this.realSelected[day] || []
        return {
          checked: !!firstRange,
          indeterminate:
            firstRange && (firstRange[0] !== 0 || firstRange[1] !== 23)
        }
      })
    },
    shortcutChecked () {
      return this.realShortcuts.map(shortcut => {
        return isEqual(shortcut.selected, this.realSelected)
      })
    },
    hourlyStates () {
      return this.week.reduce((days, day) => {
        days.push(
          [...Array(24)]
            .map((v, i) => i)
            .reduce((hours, hour) => {
              hours.push({
                disabled:
                  typeof this.disabledHour === 'function'
                    ? this.disabledHour(day, hour)
                    : false,
                ...this.getSelectState(day, hour)
              })
              return hours
            }, [])
        )
        return days
      }, [])
    },
    disabledHours () {
      return this.week.reduce((acc, day) => {
        acc[day] = [...Array(24)]
          .map((_, i) => (this.disabledHour(day, i) ? [i, i] : false))
          .filter(i => i)

        return acc
      }, {})
    },
    pickingSelected () {
      if (!this.pickingStart || !this.pickingEnd) {
        return null
      }

      let dayRange = [
        this.pickingStart.dayIndex,
        this.pickingEnd.dayIndex
      ].sort(compare)
      let hourRange = [this.pickingStart.hour, this.pickingEnd.hour].sort(
        compare
      )
      let days = [...this.week].splice(
        dayRange[0],
        dayRange[1] - dayRange[0] + 1
      )
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
      return `hour-${current.day}-${current.hour}`
    },
    currentLabel () {
      let current = this.current
      if (!current) {
        return null
      }
      return `${current.hour}:00–${current.hour + 1}:00`
    },
    realShortcuts () {
      let shortcuts = this.shortcuts || config.get('schedule.shortcuts')
      return shortcuts.map(({ label, selected }) => {
        return {
          label,
          selected: mapValues(selected, day => (day === true ? [[0, 23]] : day))
        }
      })
    },
    shortcutOptions () {
      return this.realShortcuts.map(({ label }, i) => ({ label, value: i }))
    }
  },
  watch: {
    selected: {
      handler (val) {
        this.localSelected = val ? cloneDeep(val) : []
      },
      deep: true,
      immediate: true
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
        ...(range
          ? {
            isStart: hour === range[0],
            span: range[1] - range[0] + 1,
            start: range[0],
            end: range[1],
            isWhole: range[0] === 0 && range[1] === 23
          }
          : {})
      }
    },
    mergeRange (days, range) {
      return days.reduce((selected, day) => {
        let daySelected = selected[day]
        let hours = merge([[...range]], this.disabledHours[day], {
          mode: 'substract'
        })

        if (!daySelected) {
          daySelected = []
        }
        selected[day] = merge(daySelected, hours, { mode: this.mergeMode })

        if (!selected[day] || !selected[day].length) {
          this.$delete(selected, day)
        }

        return selected
      }, cloneDeep(this.localSelected) || {})
    },
    startPicking (dayIndex, hour) {
      this.pickingStart = {
        dayIndex,
        hour
      }
      this.pickingEnd = {
        dayIndex,
        hour
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
        dayIndex,
        hour
      }
    },
    updateCurrent (dayIndex, hour) {
      this.current = {
        day: this.week[dayIndex],
        hour
      }
    },
    handleMousedown (dayIndex, hour) {
      this.mergeMode = this.hourlyStates[dayIndex][hour].isSelected
        ? 'substract'
        : 'union'
      this.startPicking(dayIndex, hour)
      this.updateCurrent(dayIndex, hour)
    },
    handleHover (dayIndex, hour) {
      this.markEnd(dayIndex, hour)
      this.updateCurrent(dayIndex, hour)
    },
    pick () {
      this.localSelected = this.pickingSelected
      this.pickingStart = this.pickingEnd = null
      this.$emit('select', this.localSelected)
    },
    selectShortcut (i) {
      this.localSelected = this.realShortcuts[i].selected
      this.$emit('select', this.localSelected)
    },
    toggleDay (day, checked) {
      if (checked) {
        this.$set(
          this.localSelected,
          day,
          merge([[0, 23]], this.disabledHours[day], { mode: 'substract' })
        )
      } else {
        this.$delete(this.localSelected, day)
      }
      this.$emit('select', this.localSelected)
    },
    moveFocus (dayIndex, hour) {
      let day = this.week[dayIndex]
      this.handleHover(dayIndex, hour)

      let el = (this.$refs[`hour-${day}-${hour}`] || [])[0]
      if (el && typeof el.focus === 'function') {
        el.focus()
      }
    },
    getHourLabel (dayIndex, hour, state) {
      let dayName = this.t('daysLong')[dayIndex]
      return this.t('hourLabel', {
        dayName,
        timeRange: `${hour}:00–${hour + 1}:00`,
        status: state.isSelected ? this.t('selected') : this.t('available')
      })
    },
    getDayLabel (dayIndex) {
      let dayName = this.t('daysLong')[dayIndex]
      return this.t('dayLabel', { dayName })
    },
    focus () {
      this.$el.focus()
    }
  }
}

function compare (a, b) {
  return a - b
}
</script>
