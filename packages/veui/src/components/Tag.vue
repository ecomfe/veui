<template>
<div
  v-if="localOpen"
  ref="box"
  :ui="ui"
  :class="{
    'veui-tag': true,
    'veui-tag-selected': localSelected,
    'veui-disabled': disabled,
    selectable: selectable
  }"
  @click="handleClick"
>
  <slot/>
  <div
    v-if="closable"
    class="veui-tag-close"
    @click="close"
  >
    <veui-icon :name="icons.close"/>
  </div>
</div>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'

export default {
  name: 'veui-tag',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, focusable],
  props: {
    closable: Boolean,
    selectable: Boolean,
    selected: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      localOpen: true,
      localSelected: this.selected
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
      this.$refs.box.focus()
    },
    handleClick () {
      if (this.selectable && !this.disabled) {
        this.localSelected = !this.localSelected
      }
    },
    close (e) {
      if (this.disabled) {
        return
      }

      this.localOpen = false
      this.$emit('close')
      e.stopPropagation()
      e.preventDefault()
    }
  }
}
</script>
