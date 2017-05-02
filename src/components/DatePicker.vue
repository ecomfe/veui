<template>
<div class="veui-datepicker">
  <veui-button :ui="buttonUI" ref="button" @click="expanded = !expanded">选择日期</veui-button>
  <veui-overlay v-if="expanded" overlay-class="veui-datepicker-overlay" target="button" :open="expanded" :options="overlay">
    <veui-calendar v-model="selected" @select="expanded = false" v-outside:button="close"></veui-calendar>
  </veui-overlay>
</div>
</template>

<script>
import Button from './Button'
import Overlay from './Overlay'
import Calendar from './Calendar'
import { dropdown } from '../mixins'

export default {
  name: 'veui-datepicker',
  components: {
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-calendar': Calendar
  },
  mixins: [dropdown],
  props: {
    ui: String
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
      selected: null
    }
  },
  methods: {
    handle (selected) {
      this.selected = selected
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-datepicker {
  display: inline-block;
  width: 160px;

  .veui-make-dropdown-button();

  &-overlay {
    .veui-calendar {
      .veui-make-overlay(dropdown);
    }
  }
}
</style>
