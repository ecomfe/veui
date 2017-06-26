<template>
  <div class="veui-dropdown" :ui="ui">
    <veui-button
      class="veui-dropdown-button"
      :ui="ui"
      :disabled="disabled"
      @click="expanded = !expanded"
      slot="target"
      ref="button">
      <span class="veui-dropdown-label">
        <slot name="label" :label="label">{{ label }}</slot>
      </span>
      <icon class="veui-dropdown-icon" :name="`${realIcon}-${expanded ? 'up' : 'down'}`"></icon>
    </veui-button>
    <veui-overlay
      v-if="expanded"
      target="button"
      :open="expanded"
      :options="overlay">
      <div ref="box" class="veui-dropdown-options" v-outside:button="close">
        <div v-for="option in options"
          :key="option.value"
          class="veui-dropdown-option"
          :class="{
            'veui-dropdown-option-disabled': option.disabled
          }"
          @click.stop="handleClick(option)">
          <slot name="button" v-bind="option">
            <span class="veui-dropdown-option-label">{{ option.label }}</span>
          </slot>
        </div>
      </div>
    </veui-overlay>
  </div>
</template>

<script>
import Icon from './Icon'
import '../icons'
import Button from './Button'
import Overlay from './Overlay'
import { ui, dropdown } from '../mixins'
import { includes } from 'lodash'

export default {
  name: 'veui-dropdown',
  components: {
    'icon': Icon,
    'veui-button': Button,
    'veui-overlay': Overlay
  },
  mixins: [ui, dropdown],
  props: {
    ui: String,
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    options: Array
  },
  data () {
    return {
      overlay: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
        constraints: [
          {
            to: 'scrollParent',
            attachment: 'together'
          }
        ]
      }
    }
  },
  computed: {
    realIcon () {
      if (this.icon) {
        return this.icon
      }
      if (includes(this.uiProps, 'link')) {
        return 'triangle'
      }
      return 'angle'
    }
  },
  methods: {
    handleClick (option) {
      if (option.disabled) {
        return
      }
      this.expanded = false
      this.$emit('click', option.value)
    }
  }
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";
@import (reference) "../styles/theme-default/dropdown.less";
@import "../styles/theme-default/dropdown-overflow.less";

.veui-dropdown {
  &:extend(._veui-dropdown-button all);
  display: inline-block;
  width: 110px;

  &-options {
    &:extend(._veui-dropdown-overlay all);
    min-width: 110px;
    max-height: 280px;
    overflow-y: auto;
    background-color: #fff;
  }

  &-option {
    &:extend(._veui-dropdown-option all);
  }

  &[ui~="link"] &-button {
    padding: 9px 12px;
  }
}
</style>
