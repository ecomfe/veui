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
    @keydown.down.up.prevent="expanded = true"
    @click="expanded = !expanded"
    ref="button">
    <span class="veui-select-label">
      <slot name="label" :label="label">{{ label }}</slot>
    </span>
    <icon class="veui-select-icon" :name="icons[expanded ? 'collapse' : 'expand']"></icon>
  </veui-button>
  <veui-overlay
    v-if="options && expanded || !options"
    v-show="expanded"
    target="button"
    :open="expanded"
    autofocus
    modal
    :options="realOverlayOptions"
    :overlay-class="overlayClass">
    <div
      ref="box"
      class="veui-select-options"
      v-outside:button="close"
      tabindex="-1"
      :ui="ui"
      @keydown.esc.stop="expanded = false"
      @keydown.down.prevent="navigate()"
      @keydown.up.prevent="navigate(false)">
      <veui-option-group :options="options" ref="options">
        <slot></slot>
        <template v-if="$scopedSlots['group-label']" slot="label" slot-scope="group">
          <slot name="group-label" v-bind="group"></slot>
        </template>
        <template v-if="$scopedSlots.option" slot="option" slot-scope="option">
          <slot name="option" v-bind="option"></slot>
        </template>
        <template v-if="$scopedSlots['option-label']" slot="option-label" slot-scope="option">
          <slot name="option-label" v-bind="option"></slot>
        </template>
      </veui-option-group>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import Icon from '../Icon'
import Button from '../Button'
import Option from './Option'
import OptionGroup from './OptionGroup'
import Overlay from '../Overlay'
import input from '../../mixins/input'
import select from '../../mixins/select'
import icons from '../../mixins/icons'
import overlay from '../../mixins/overlay'
import dropdown from '../../mixins/dropdown'
import warn from '../../utils/warn'

export default {
  name: 'veui-select',
  uiTypes: ['select'],
  mixins: [input, icons, overlay, dropdown, select],
  model: {
    event: 'change'
  },
  components: {
    Icon,
    'veui-button': Button,
    'veui-option': Option,
    'veui-option-group': OptionGroup,
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
      if (this.labelMap) {
        return this.labelMap[this.value]
      }
      let option = this.$refs.options.find(this.value)
      return option ? option.label : ''
    }
  },
  methods: {
    handleSelect (value) {
      this.expanded = false
      this.localValue = value
    }
  },
  watch: {
    value (val) {
      this.localValue = val
    },
    localValue (val) {
      if (this.value !== val) {
        this.$emit('change', val)
      }
    }
  }
}

function extractOptions (options, map) {
  if (!options) {
    return null
  }
  options.forEach(({ label, value, options }) => {
    if (value != null) {
      if (map[value]) {
        warn(`Duplicate item value [${value}] for select options.`)
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
