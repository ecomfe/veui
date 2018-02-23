<template>
<div class="veui-dropdown" :ui="ui"
  :class="{
    'veui-dropdown-expanded': expanded
  }">
  <veui-button
    class="veui-dropdown-button"
    :ui="ui"
    :disabled="disabled"
    @keydown.down.up.prevent="expanded = true"
    @click="expanded = !expanded"
    ref="button">
    <span class="veui-dropdown-label">
      <slot name="label" :label="label">{{ label }}</slot>
    </span>
    <icon class="veui-dropdown-icon" :name="icons[expanded ? 'collapse': 'expand']"></icon>
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
      class="veui-dropdown-options"
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
import Icon from './Icon'
import Button from './Button'
import Overlay from './Overlay'
import OptionGroup from './Select/OptionGroup'
import icons from '../mixins/icons'
import overlay from '../mixins/overlay'
import dropdown from '../mixins/dropdown'
import keySelect from '../mixins/key-select'

export default {
  name: 'veui-dropdown',
  uiTypes: ['select'],
  components: {
    'icon': Icon,
    'veui-button': Button,
    'veui-overlay': Overlay,
    'veui-option-group': OptionGroup
  },
  mixins: [icons, overlay, dropdown, keySelect],
  props: {
    ui: String,
    label: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: Array
  },
  methods: {
    handleSelect (value) {
      this.expanded = false
      if (value != null) {
        this.$emit('click', value)
      }
    }
  }
}
</script>
