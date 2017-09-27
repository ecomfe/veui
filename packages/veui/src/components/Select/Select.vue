<template>
<div class="veui-select" :ui="ui"
  :class="{
    'veui-select-empty': value === null,
    'veui-select-expanded': expanded
  }">
  <veui-button
    class="veui-select-button"
    :ui="ui"
    :disabled="realDisabled || realReadonly"
    @click="expanded = !expanded"
    ref="button">
    <span class="veui-select-label">
      <slot name="label" :label="label">{{ label }}</slot>
    </span>
    <icon class="veui-select-icon" :name="icons[expanded ? 'collapse' : 'expand']"></icon>
  </veui-button>
  <veui-overlay
    v-if="expanded"
    target="button"
    :open="expanded"
    :options="realOverlayOptions"
    :overlay-class="overlayClass">
    <div ref="box" class="veui-select-options" v-outside:button="close">
      <slot>
        <template v-for="(option, index) in realOptions">
          <div v-if="option.options" :class="{
            'veui-select-option-group': true,
            'veui-select-option-group-unlabelled': !option.label
          }" :key="`g-${index}`">
            <slot v-if="option.label" name="group-label" :label="option.label">
              <div class="veui-select-option-group-label">{{ option.label }}</div>
            </slot>
            <veui-option
              v-for="subOption in option.options"
              v-bind="subOption"
              :ui="ui"
              :selected="subOption.value === value"
              :key="subOption.value"
              @select="handleSelect(subOption)">
              <slot name="option" v-bind="subOption" :selected="option.value === value"></slot>
            </veui-option>
          </div>
          <veui-option
            v-else
            v-bind="option"
            :ui="ui"
            :selected="option.value === value"
            :key="option.value"
            @select="handleSelect(option)">
              <slot name="option" v-bind="option" :selected="option.value === value"></slot>
          </veui-option>
        </template>
      </slot>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import Vue from 'vue'
import Icon from '../Icon'
import Button from '../Button'
import Option from './Option'
import Overlay from '../Overlay'
import { input, icons, overlay, dropdown } from '../../mixins'

export default {
  name: 'veui-select',
  mixins: [input, icons, overlay, dropdown],
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
    clearable: Boolean,
    options: Array
  },
  data () {
    return {
      localValue: this.value
    }
  },
  computed: {
    realOptions () {
      if (this.clearable) {
        return [
          { label: this.placeholder, value: null },
          ...this.options
        ]
      }
      return this.options
    },
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
    handleSelect ({ disabled, value }) {
      if (disabled) {
        return
      }
      this.expanded = false
      this.localValue = value
      this.$emit('change', value)
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    }
  }
}

function extractOptions (options, map) {
  options.forEach(({ label, value, options }) => {
    if (value != null) {
      if (map[value]) {
        Vue.utils.warn(`Duplicate item value [${value}] for select options.`)
      }
      map[value] = label
    }
    if (options) {
      extractOptions(options, map)
    }
  })
  return map
}
</script>
