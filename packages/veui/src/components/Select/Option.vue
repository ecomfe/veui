<template>
<button
  type="button"
  class="veui-option"
  v-show="!hidden"
  :tabindex="hidden ? -1 : false"
  :ui="ui"
  :class="{
    'veui-option-disabled': disabled,
    'veui-option-selected': selected
  }"
  :autofocus="selected"
  @click.stop="selectOption">
  <slot>
    <span class="veui-option-label"><slot name="label">{{ label }}</slot></span>
    <veui-icon class="veui-option-checkmark" v-if="selected" :name="icons.checked"/>
  </slot>
</button>
</template>

<script>
import Icon from '../Icon'
import ui from '../../mixins/ui'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import { getScrollParent } from '../../utils/dom'

export default {
  name: 'veui-option',
  mixins: [ui, menu, select],
  components: {
    'veui-icon': Icon
  },
  props: {
    label: {
      type: [String, Number]
    },
    value: null,
    disabled: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selected () {
      return this.value != null && this.value === this.select.value
    }
  },
  methods: {
    selectOption () {
      if (!this.disabled) {
        this.$emit('click')
        let menu = this.menu
        while (menu) {
          menu.close()
          menu = menu.menu
        }
        this.select.handleSelect(this.value)
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
