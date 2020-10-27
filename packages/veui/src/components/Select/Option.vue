<template>
<div
  :is="tag"
  v-show="!hidden"
  :type="tag === 'button' ? 'button' : null"
  :tabindex="hidden ? -1 : false"
  :ui="realUi"
  :class="{
    [$c('option')]: true,
    [$c('option-disabled')]: disabled,
    [$c('option-selected')]: selected
  }"
  :data-autofocus="selected"
  :role="role"
  :disabled="disabled"
  :aria-selected="selected"
  @click.stop="selectOption"
>
  <slot>
    <span :class="$c('option-label')">
      <slot name="label">
        {{ label }}
      </slot>
    </span>
  </slot>
</div>
</template>

<script>
import prefix from '../../mixins/prefix'
import ui from '../../mixins/ui'
import menu from '../../mixins/menu'
import select from '../../mixins/select'
import { scrollIntoView } from '../../utils/dom'
import { isType } from '../../utils/helper'

export default {
  name: 'veui-option',
  mixins: [prefix, ui, menu, select],
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
    },
    tag: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    selected () {
      if (!this.select || this.value == null || this.select.value == null) {
        return false
      }
      let selectValue = this.select.value
      return Array.isArray(selectValue)
        ? selectValue.indexOf(this.value) !== -1
        : selectValue === this.value
    },
    role () {
      return isType(this.select, 'input') ? 'option' : 'menuitem'
    }
  },
  watch: {
    'select.expanded' (val) {
      if (val && this.selected && !this.select.multiple) {
        this.select.$once('afteropen', this.scrollIntoView)
      }
    }
  },
  methods: {
    scrollIntoView () {
      scrollIntoView(this.$el)
    },
    selectOption () {
      if (!this.disabled) {
        this.$emit('click')

        if (this.select) {
          if (!this.select.multiple) {
            let menu = this.menu
            while (menu) {
              menu.close()
              menu = menu.menu
            }
          }
          this.select.handleSelect(this.value)
        }
      }
    }
  }
}
</script>
