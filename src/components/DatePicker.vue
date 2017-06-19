<template>
<div class="veui-datepicker" :ui="ui"
  :class="{
    'veui-datepicker-empty': !selected,
    'veui-datepicker-range': range,
    'veui-datepicker-expanded': expanded
  }">
  <veui-button ref="button" class="veui-datepicker-button" :ui="buttonUI" :disabled="disabled || readonly" @click="expanded = !expanded">
    <template v-if="range">
      <span class="veui-datepicker-label">
        <slot v-if="formatted" name="date" :formatted="formatted ? formatted[0] : null" :date="selected ? selected[0] : null">{{ formatted[0] }}</slot>
        <slot v-else name="placeholder-begin">开始时间</slot>
      </span>
      <span class="veui-datepicker-tilde">~</span>
      <span class="veui-datepicker-label">
        <slot v-if="formatted" name="date" :formatted="formatted ? formatted[1] : null" :date="selected ? selected[1] : null">{{ formatted[1] }}</slot>
        <slot v-else name="placeholder-end">结束时间</slot>
      </span>
    </template>
    <template v-else>
      <span class="veui-datepicker-label">
        <slot v-if="formatted" name="date" :date="formatted">{{ formatted }}</slot>
        <slot v-else name="placeholder">{{ placeholder }}</slot>
      </span>
    </template>
    <veui-icon class="veui-datepicker-icon" name="calendar"></veui-icon>
  </veui-button>
  <button v-if="clearable" v-show="!!selected" class="veui-datepicker-clear" @click="clear">
    <veui-icon name="cross"></veui-icon>
  </button>
  <veui-overlay v-if="expanded" target="button" :open="expanded" :options="overlay">
    <veui-calendar class="veui-datepicker-overlay" v-model="localSelected" v-bind="calendarProps"
      v-outside:button="close" @select="handleSelect" @selectstart="handleStart" :panel="realPanel">
      <template v-if="range && shortcuts && shortcuts.length">
        <div class="veui-datepicker-shortcuts">
          <veui-button ui="small link" class="veui-datepicker-shortcut" v-for="(shortcut, index) in shortcuts" :key="index" @click="selectShortcut(shortcut)">{{ shortcut.label }}</veui-button>
        </div>
      </template>
    </veui-calendar>
  </veui-overlay>
</div>
</template>

<script>
import Button from './Button'
import Overlay from './Overlay'
import Calendar from './Calendar'
import Icon from './Icon'
import '../icons'
import moment from 'moment'
import { dropdown, input } from '../mixins'
import { config } from '../managers'
import { isArray, isObject, pick } from 'lodash'

config.defaults({
  'datepicker.shortcuts': []
})

let calendarProps = ['range', 'weekStart', 'fillMonth', 'disabledDate', 'dateClass']

export default {
  name: 'veui-datepicker',
  components: {
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-calendar': Calendar,
    'veui-icon': Icon
  },
  mixins: [dropdown, input],
  model: {
    prop: 'selected',
    event: 'select'
  },
  props: {
    ui: String,
    selected: {
      type: [Array, Date],
      default () {
        return null
      }
    },
    panel: Number,
    clearable: Boolean,
    placeholder: {
      type: String,
      default: '选择时间'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    shortcuts: {
      type: Array,
      default () {
        return config.get('datepicker.shortcuts')
      }
    },
    ...pick(Calendar.props, calendarProps)
  },
  data () {
    return {
      picking: null,
      localSelected: this.selected
    }
  },
  computed: {
    formatted () {
      let selected = this.localSelected
      if (this.range) {
        let current = this.picking || selected
        if (isArray(current)) {
          return current.map(date => this.formatDate(date))
        }
      }
      if (!selected) {
        return ''
      }
      return this.formatDate(selected)
    },
    calendarProps () {
      return pick(this, calendarProps)
    },
    realPanel () {
      return this.panel || (this.range ? 2 : 1)
    }
  },
  methods: {
    formatDate (date) {
      if (!date) {
        return ''
      }
      return moment(date).format(this.format)
    },
    handleSelect (selected) {
      this.$emit('select', selected)
      this.picking = null
      this.expanded = false
    },
    handleStart (selected) {
      this.picking = [selected]
    },
    selectShortcut ({range}) {
      if (isObject(range)) {
        let now = new Date()
        let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        let otherDay = moment(today).add(range).toDate()
        if (today < otherDay) {
          this.handleSelect([today, otherDay])
        } else {
          this.handleSelect([otherDay, today])
        }
      }
    },
    clear (e) {
      this.$emit('select', null)
      this.expanded = false
    },
    close () {
      this.expanded = false
      this.picking = null
    }
  },
  watch: {
    selected (value) {
      this.localSelected = value
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
@import (reference) "../styles/theme-default/dropdown.less";

.veui-datepicker {
  &:extend(._veui-dropdown-button all);

  position: relative;
  display: inline-block;
  width: 160px;

  &-overlay {
    &:extend(._veui-dropdown-overlay all);
  }

  &-empty {
    .veui-button {
      color: @veui-text-color-weak;
    }
  }

  &-clear {
    display: none;
    .absolute(10px, 12px, _, _);
    .size(16px);
    background: #fff;
    outline: none;
    border: none;
    padding: 0;
    color: @veui-text-color-weak;
    cursor: pointer;

    &:hover {
      color: @veui-text-color-normal;
    }
  }

  &-clear:hover,
  .veui-button:hover + &-clear {
    display: block;
  }

  &-range {
    width: 300px;

    .veui-datepicker-label {
      width: (300px - 12px * 4 - 16px * 2) / 2;
    }
  }

  &-tilde {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    width: 16px;
    margin: 0 12px;
  }

  &-shortcuts {
    height: 40px;
    padding: 10px 16px;
    border-top: 1px solid @veui-gray-color-sup-2;
  }

  &-shortcut {
    margin-right: 10px;
    border: none;
    color: @veui-text-color-normal;
    font-size: @veui-font-size-small;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
