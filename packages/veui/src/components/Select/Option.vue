<template>
<div class="veui-option"
  :ui="ui"
  :class="{
    'veui-option-disabled': disabled,
    'veui-option-selected': selected
  }"
  @click.stop="select">
  <slot>
    <span class="veui-option-label"><slot name="label">{{ label }}</slot></span>
    <icon class="veui-option-checkmark" v-if="selected" :name="icons.checked"></icon>
  </slot>
</div>
</template>

<script>
import Icon from '../Icon'
import { icons } from '../../mixins'

export default {
  name: 'veui-option',
  mixins: [icons],
  components: {
    Icon
  },
  props: {
    label: [String, Number],
    value: {
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    ui: String
  },
  methods: {
    select () {
      if (!this.disabled) {
        this.$emit('select', this.value)
      }
    }
  },
  mounted () {
    if (this.selected) {
      this.$nextTick(() => {
        this.$el.scrollIntoView()
      })
    }
  }
}
</script>
