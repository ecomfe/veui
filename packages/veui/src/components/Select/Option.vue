<template>
<button
  v-show="!hidden"
  type="button"
  class="veui-option"
  :tabindex="hidden ? -1 : false"
  :ui="realUi"
  :class="{
    'veui-option-disabled': disabled,
    'veui-option-selected': selected
  }"
  :data-autofocus="selected"
  :role="role"
  :aria-selected="selected"
  @click.stop="selectOption"
>
  <slot>
    <span class="veui-option-label">
      <slot name="label">
        {{ label }}
      </slot>
    </span>
    <veui-icon
      v-if="selected"
      class="veui-option-checkmark"
      :name="icons.checked"
    />
  </slot>
</button>
</template>

<script>
import Icon from '../Icon'
import ui from '../../mixins/ui'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import { getScrollParent } from '../../utils/dom'
import { isType } from '../../utils/helper'

export default {
  name: 'veui-option',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, menu, select],
  props: {
    label: {
      type: [String, Number]
    },
    /* eslint-disable vue/require-prop-types */
    value: {},
    /* eslint-enable vue/require-prop-types */
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
    },
    role () {
      return isType(this.select, 'input') ? 'option' : 'menuitem'
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
  }
}
</script>
