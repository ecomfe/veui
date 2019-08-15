<template>
<div
  v-if="localOpen"
  :tabindex="tabIndex"
  :ui="ui"
  :class="{
    'veui-tag': true,
    [`veui-tag-${type}`]: true,
    'veui-tag-selected': localSelected,
    'veui-disabled': disabled,
    'veui-tag-selectable': selectable
  }"
  @click="handleClick"
>
  <slot/>
  <veui-button
    v-if="closable"
    :ui="uiParts.close"
    class="veui-tag-close"
    :disabled="disabled"
    @click.prevent.stop="close"
  >
    <veui-icon :name="icons.close"/>
  </veui-button>
</div>
</template>

<script>
import Button from './Button'
import Icon from './Icon'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'

export default {
  name: 'veui-tag',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [ui, focusable],
  props: {
    type: {
      type: String,
      default: 'default'
    },
    closable: Boolean,
    selectable: Boolean,
    selected: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      localOpen: true,
      localSelected: this.selected,
      focused: false
    }
  },
  computed: {
    tabIndex () {
      return this.disabled ? -1 : 0
    }
  },
  watch: {
    selected (val) {
      this.localSelected = val
    },
    localSelected (val) {
      if (this.selected !== val) {
        this.$emit('update:selected', this.localSelected)
      }
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    handleClick (e) {
      if (this.selectable && !this.disabled) {
        this.localSelected = !this.localSelected
      }
      this.$el.blur()
    },
    close () {
      if (this.disabled) {
        return
      }

      this.localOpen = false
      this.$emit('close')
    }
  }
}
</script>
