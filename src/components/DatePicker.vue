<template>
<div class="veui-datepicker" :ui="ui"
  :class="{
    'veui-datepicker-empty': value === null,
    'veui-datepicker-expanded': expanded
  }">
  <veui-button :ui="buttonUI" ref="button" @click="expanded = !expanded">
    <span>{{ formatted || placeholder }}</span>
    <veui-icon name="calendar"></veui-icon>
  </veui-button>
  <button v-show="!!selected" class="veui-datepicker-clear" @click="clear($event)"><veui-icon name="remove"></veui-icon></button>
  <veui-overlay v-if="expanded" target="button" :open="expanded" :options="overlay">
    <veui-calendar class="veui-overlay-dropdown" v-model="localSelected" @select="handleSelect" v-outside:button="close"></veui-calendar>
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
import 'vue-awesome/icons/calendar'
import 'vue-awesome/icons/remove'

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
      type: Date,
      default () {
        return null
      }
    },
    placeholder: {
      type: String,
      default: '选择日期'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  data () {
    return {
      expanded: false,
      overlay: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together'
          }
        ]
      },
      localSelected: this.selected
    }
  },
  computed: {
    formatted () {
      let day = this.selected
      if (!day) {
        return ''
      }
      return moment(day).format(this.format)
    }
  },
  methods: {
    handleSelect (selected) {
      this.$emit('select', selected)
      this.expanded = false
    },
    clear (e) {
      this.$emit('select', null)
      this.expanded = false
      e.stopPropagation()
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

  &-clear {
    .absolute(11px, 38px, _, _);
    background: none;
    outline: none;
    border: none;
    padding: 0;
    color: @veui-text-color-weak;
    cursor: pointer;

    &:hover {
      color: @veui-text-color-normal;
    }
  }
}
</style>
