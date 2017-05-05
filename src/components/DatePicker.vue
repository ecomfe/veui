<template>
<div class="veui-datepicker" :ui="ui"
  :class="{
    'veui-datepicker-empty': !selected,
    'veui-datepicker-range': range,
    'veui-datepicker-expanded': expanded
  }">
  <veui-button :ui="buttonUI" ref="button" @click="expanded = !expanded">
    <template v-if="range">
      <span class="veui-dropdown-label">
        <slot v-if="formatted" name="date" :formatted="formatted ? formatted[0] : null" :date="selected ? selected[0] : null">{{ formatted[0] }}</slot>
        <slot v-else name="placeholder-begin">开始时间</slot>
      </span>
      <span class="veui-datepicker-tilde">~</span>
      <span class="veui-dropdown-label">
        <slot v-if="formatted" name="date" :formatted="formatted ? formatted[1] : null" :date="selected ? selected[1] : null">{{ formatted[1] }}</slot>
        <slot v-else name="placeholder-end">结束时间</slot>
      </span>
    </template>
    <template v-else>
      <span class="veui-dropdown-label">
        <slot v-if="formatted" name="date" :date="formatted">{{ formatted }}</slot>
        <slot v-else name="placeholder">{{ placeholder }}</slot>
      </span>
    </template>
    <veui-icon name="calendar"></veui-icon>
  </veui-button>
  <button v-if="clearable" v-show="!!selected" class="veui-datepicker-clear" @click="clear">
    <veui-icon name="remove"></veui-icon>
  </button>
  <veui-overlay v-if="expanded" target="button" :open="expanded" :options="overlay">
    <veui-calendar class="veui-overlay-dropdown" v-model="localSelected" v-bind="calendarProps"
      v-outside:button="close" @select="handleSelect" :panel="realPanel"></veui-calendar>
  </veui-overlay>
</div>
</template>

<script>
import Button from './Button'
import Overlay from './Overlay'
import Calendar from './Calendar'
import Icon from './Icon'
import moment from 'moment'
import { dropdown, input } from '../mixins'
import { isArray, pick } from 'lodash'
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/remove'

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
    ...pick(Calendar.props, calendarProps)
  },
  data () {
    return {
      localSelected: this.selected
    }
  },
  computed: {
    formatted () {
      let selected = this.localSelected
      if (!selected) {
        return ''
      }
      if (isArray(selected)) {
        return selected.map(date => this.formatDate(date))
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
      return moment(date).format(this.format)
    },
    handleSelect (selected) {
      this.$emit('select', selected)
      this.expanded = false
    },
    clear (e) {
      this.$emit('select', null)
      this.expanded = false
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

.veui-datepicker {
  position: relative;
  display: inline-block;
  width: 160px;

  .veui-make-dropdown-button();

  &-empty {
    .veui-button {
      color: @veui-text-color-weak;
    }
  }

  &-clear {
    display: none;
    .absolute(11px, 12px, _, _);
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
    width: 313px;

    .veui-button .veui-dropdown-label {
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
}
</style>
