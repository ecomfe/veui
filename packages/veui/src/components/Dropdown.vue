<template>
<div
  ref="main"
  :ui="realUi"
  :class="{
    'veui-dropdown': true,
    'veui-dropdown-expanded': expanded,
    'veui-dropdown-split': split
  }">
  <veui-button
    v-if="split"
    class="veui-dropdown-command"
    @click="$emit('click')">
    <span class="veui-dropdown-label">
      <slot name="label" :label="label">{{ label }}</slot>
    </span>
  </veui-button>
  <veui-button
    class="veui-dropdown-button"
    :disabled="disabled"
    aria-haspopup="menu"
    :aria-disabled="String(this.disabled)"
    v-on="toggleHandlers"
    @keydown.down.up.prevent="expanded = true"
    ref="button">
    <span class="veui-dropdown-label" v-if="!split">
      <slot name="label" :label="label">{{ label }}</slot>
    </span>
    <veui-icon class="veui-dropdown-icon" :name="icons[expanded ? 'collapse' : 'expand']"/>
  </veui-button>
  <veui-overlay
    target="main"
    :open="expanded"
    autofocus
    modal
    :options="realOverlayOptions"
    :overlay-class="overlayClass">
    <div
      ref="box"
      class="veui-dropdown-options"
      v-outside="{
        refs: outsideRefs,
        handler: close,
        trigger,
        delay: 300
      }"
      tabindex="-1"
      role="menu"
      :aria-expanded="String(expanded)"
      @keydown.esc.stop="close"
      @keydown.down.prevent="navigate()"
      @keydown.up.prevent="navigate(false)">
      <veui-option-group :options="options" ref="options">
        <slot/>
        <template v-if="$scopedSlots['group-label']" slot="label" slot-scope="group">
          <slot name="group-label" v-bind="group"/>
        </template>
        <template v-if="$scopedSlots.option" slot="option" slot-scope="option">
          <slot name="option" v-bind="option"/>
        </template>
        <template v-if="$scopedSlots['option-label']" slot="option-label" slot-scope="option">
          <slot name="option-label" v-bind="option"/>
        </template>
      </veui-option-group>
    </div>
  </veui-overlay>
</div>
</template>

<script>
import Icon from './Icon'
import Button from './Button'
import Overlay from './Overlay'
import OptionGroup from './Select/OptionGroup'
import ui from '../mixins/ui'
import overlay from '../mixins/overlay'
import dropdown from '../mixins/dropdown'
import keySelect from '../mixins/key-select'
import '../common/uiTypes'
import { includes } from 'lodash'

const EVENT_MAP = {
  hover: 'mouseenter',
  click: 'click'
}

const MODE_MAP = {
  hover: 'expand',
  click: 'toggle'
}

export default {
  name: 'veui-dropdown',
  uiTypes: ['select'],
  components: {
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-option-group': OptionGroup
  },
  mixins: [ui, overlay, dropdown, keySelect],
  props: {
    label: String,
    disabled: Boolean,
    options: Array,
    trigger: {
      type: String,
      default: 'click',
      validator (val) {
        return includes(['focus', 'hover', 'click'], val)
      }
    },
    split: Boolean,
    memoize: Boolean
  },
  data () {
    return {
      outsideRefs: ['button']
    }
  },
  computed: {
    toggleHandlers () {
      return {
        [EVENT_MAP[this.trigger]]: this.handleToggle
      }
    }
  },
  methods: {
    handleToggle () {
      let mode = MODE_MAP[this.trigger]
      if (mode === 'toggle') {
        this.expanded = !this.expanded
      } else if (mode === 'expand') {
        this.expanded = true
      }
    },
    handleSelect (value) {
      this.expanded = false
      if (value != null) {
        this.$emit('click', value)
      }
    }
  }
}
</script>
