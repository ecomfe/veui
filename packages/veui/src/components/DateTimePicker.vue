<template>
  <div :class="[$c('date-time-picker'), { [$c('disabled')]: realDisabled, [$c('readonly')]: realReadonly }]">
    <veui-input
      ref="input"
      v-model="realInputValue"
      :disabled="realDisabled"
      :readonly="realReadonly"
      :placeholder="placeholder"
      @focus="openDropdown"
      @click="openDropdown"
      @keydown.enter="closeDropdown"
    >
      <veui-button
        v-if="clearable && localValue"
        :class="$c('date-time-picker-clear')"
        :ui="uiParts.clear"
        :aria-label="t('clear')"
        :disabled="realDisabled || realReadonly"
        @click="clear"
        @mouseup.stop
      >
        <veui-icon :name="icons.clear"/>
      </veui-button>
    </veui-input>
    <veui-overlay
      v-show="realExpanded"
      ref="overlay"
      target="self"
      match-width
      :overlay-class="mergeOverlayClass({ [$c('date-time-picker-overlay')]: true })"
      :overlay-style="overlayStyle"
      :local="realOverlayOptions.local"
      :options="realOverlayOptions"
      :open="realExpanded"
      @afteropen="scrollSelectedToCenter(0)"
    >
      <veui-calendar
        :ui="realUi"
        role="dialog"
        :options="realHours"
        :value="realValue[0]"
        @change="handleDropdownChange(0, $event)"
      />
    </veui-overlay>
  </div>
</template>

<script>
import Overlay from '../Overlay'
import Input from '../Input'
import Button from '../Button'
import Icon from '../Icon'
import Calendar from '../Calendar'
import prefix from '../../mixins/prefix'
import dropdown from '../../mixins/dropdown'
import useControllable from '../../mixins/controllable'
import ui from '../../mixins/ui'
import input from '../../mixins/input'
import i18n from '../../mixins/i18n'
import { range, padStart, isEqual, includes, get, times, constant, startOf, toDateData, lt, add } from '../../utils'

export default {
  name: 'veui-date-time-picker',
  components: {
    'veui-overlay': Overlay,
    'veui-input': Input,
    'veui-button': Button,
    'veui-icon': Icon,
    'veui-calendar': Calendar
  },
  mixins: [prefix, ui, input, dropdown, useControllable, i18n],
  props: {
    value: [String, Date],
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean,
    clearable: Boolean
  },
  data () {
    return {
      realValue: this.value,
      realExpanded: false
    }
  },
  computed: {
    realInputValue: {
      get () {
        return this.formatDateTime(this.realValue)
      },
      set (val) {
        this.realValue = this.parseDateTime(val)
      }
    }
  },
  methods: {
    openDropdown () {
      this.realExpanded = true
    },
    closeDropdown () {
      this.realExpanded = false
    },
    clear () {
      this.realValue = null
    },
    formatDateTime (value) {
      let dateData = toDateData(value)
      return `${dateData.year}-${padStart(dateData.month, 2, '0')}-${padStart(dateData.day, 2, '0')} ${padStart(dateData.hours, 2, '0')}:${padStart(dateData.minutes, 2, '0')}`
    },
    parseDateTime (value) {
      let [datePart, timePart] = value.split(' ')
      let [year, month, day] = datePart.split('-').map(Number)
      let [hours, minutes] = timePart.split(':').map(Number)
      return add(startOf(new Date(year, month - 1, day), 'day'), { hours, minutes })
    },
    handleDropdownChange (index, value) {
      this.realValue = value
    }
  }
}
</script>

<style>
.veui-date-time-picker {
  /* Add necessary styles here */
}
</style>
