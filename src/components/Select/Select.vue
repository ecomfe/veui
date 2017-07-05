<template>
  <div class="veui-select" :ui="ui"
    :class="{
      'veui-select-empty': value === null,
      'veui-select-expanded': expanded
    }">
    <veui-button
      class="veui-select-button"
      :ui="buttonUI"
      :disabled="realDisabled || realReadonly"
      @click="expanded = !expanded"
      ref="button">
      <span class="veui-select-label">
        <slot name="label" :label="label">{{ label }}</slot>
      </span>
      <icon class="veui-select-icon" :name="`triangle-${expanded ? 'up' : 'down'}`"></icon>
    </veui-button>
    <veui-overlay
      v-if="expanded"
      target="button"
      :open="expanded"
      :options="overlay">
      <div ref="box" class="veui-select-options" :ui="ui" v-outside:button="close">
        <slot>
          <template v-for="option in options">
            <veui-option
              v-if="option.value"
              v-bind="option"
              :selected="option.value === value"
              :key="option.value"
              @select="handleSelect(option)">
                <slot name="option" v-bind="option" :selected="option.value === value"></slot>
            </veui-option>
            <div v-else-if="option.options" class="veui-select-option-group">
              <slot name="group-label" :label="option.label">
                <div class="veui-select-group-label">{{ option.label }}</div>
              </slot>
              <veui-option
                v-for="subOption in option.options"
                v-bind="subOption"
                :selected="subOption.value === value"
                :key="subOption.value"
                @select="handleSelect">
                <slot name="option" v-bind="subOption" :selected="option.value === value"></slot>
              </veui-option>
            </div>
          </template>
        </slot>
      </div>
    </veui-overlay>
  </div>
</template>

<script>
import Icon from '../Icon'
import '../../icons'
import Button from '../Button'
import Option from './Option'
import Overlay from '../Overlay'
import { input, dropdown } from '../../mixins'

export default {
  name: 'veui-select',
  mixins: [input, dropdown],
  model: {
    event: 'change'
  },
  components: {
    Icon,
    'veui-button': Button,
    'veui-option': Option,
    'veui-overlay': Overlay
  },
  props: {
    ui: String,
    value: null,
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkmark: {
      type: Boolean,
      default: false
    },
    options: Array
  },
  computed: {
    labelMap () {
      return extractOptions(this.options, {})
    },
    label () {
      if (this.value === null) {
        return this.placeholder
      }
      return this.labelMap[this.value]
    }
  },
  methods: {
    handleSelect (option) {
      if (option.disabled) {
        return
      }
      this.expanded = false
      this.$emit('change', option.value)
    }
  }
}

function extractOptions (options, map) {
  options.forEach(({ label, value, options }) => {
    map[value] = label
    if (options) {
      extractOptions(options, map)
    }
  })
  return map
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";
@import (reference) "../../styles/theme-default/dropdown.less";
@import (reference) "../../styles/theme-default/input.less";
@import "../../styles/theme-default/dropdown-overflow.less";

.veui-select {
  &:extend(._veui-dropdown-button all);

  .veui-field-invalid & .veui-button.veui-select-button {
    &:extend(._veui-input-invalid all);
  }

  display: inline-block;
  width: 160px;

  &-options {
    &:extend(._veui-dropdown-overlay all);
    min-width: 160px;
    max-height: 280px;
    overflow-y: auto;
    background-color: #fff;
  }

  &-option-group {
    .veui-select-group-label {
      display: inline-block;
      .centered-line(@veui-height-normal);
      padding: 0 10px;
      font-size: @veui-font-size-small;
      color: @veui-gray-color-weak;
    }

    .veui-option {
      padding-left: 20px;
    }
  }
}
</style>
