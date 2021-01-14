<template>
<div :class="$c('uploader-controls')">
  <template v-for="(control, controlIndex) in items">
    <veui-dropdown
      v-if="control.children && control.children.length"
      :key="`${control.label}-${controlIndex}`"
      :class="$c('control-item')"
      :options="control.children"
      :expanded="expanded"
      trigger="hover"
      @click="handleButtonClick"
      @toggle="handleDropdownToggle"
    >
      <template
        slot="trigger"
        slot-scope="{ props, handlers }"
      >
        <veui-button
          :key="control.name"
          :ui="$parent.$parent.uiParts.control"
          :disabled="
            control.disabled !== undefined ? control.disabled : disabled
          "
          :tabindex="disabled ? null : 0"
          :aria-label="control.label"
          v-bind="props"
          v-on="handlers"
        >
          <veui-icon :name="control.icon"/>
          <template v-if="showLabel">{{ control.label }}</template>
        </veui-button>
      </template>
    </veui-dropdown>
    <veui-button
      v-else
      :key="control.name"
      :ui="$parent.$parent.uiParts.control"
      :disabled="control.disabled !== undefined ? control.disabled : disabled"
      :class="$c('control-item')"
      :tabindex="disabled ? null : 0"
      :aria-label="control.label"
      @click="handleButtonClick(control.name)"
    >
      <veui-icon :name="control.icon"/>
      <template v-if="showLabel">{{ control.label }}</template>
    </veui-button>
  </template>
</div>
</template>

<script>
import Button from '../Button'
import Icon from '../Icon'
import Dropdown from '../Dropdown'
import prefix from '../../mixins/prefix'

export default {
  name: 'veui-uploader-controls',
  components: {
    'veui-icon': Icon,
    'veui-button': Button,
    'veui-dropdown': Dropdown
  },
  mixins: [prefix],
  props: {
    items: Array,
    expanded: Boolean,
    disabled: Boolean,
    showLabel: Boolean
  },
  methods: {
    handleButtonClick (val) {
      this.$emit('click', val)
    },
    handleDropdownToggle (expanded) {
      this.$emit('update:expanded', expanded)
    }
  }
}
</script>
