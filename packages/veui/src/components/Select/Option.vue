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
import icons from '../../mixins/icons'
import { getScrollParent } from '../../utils/dom'

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
        let el = this.$el
        let container = getScrollParent(el)
        if (!container) {
          return
        }
        let { top: cTop, bottom: cBottom } = container.getBoundingClientRect()
        let { top: oTop, bottom: oBottom } = el.getBoundingClientRect()

        // fully visible
        if (oTop >= cTop && oBottom <= cBottom) {
          return
        }
        if (oTop < cTop) {
          container.scrollTop -= cTop - oTop
        } else {
          container.scrollTop += oBottom - cBottom
        }
      })
    }
  }
}
</script>
