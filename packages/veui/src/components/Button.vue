<template>
<button
  :class="{
    'veui-button': true,
    'veui-button-loading': loading,
    'veui-disabled': disabled,
    'focus-visible': focusVisible
  }"
  :ui="realUi"
  v-bind="attrs"
  v-on="$listeners"
  @focus="handleFocus"
  @blur="handleBlur"
>
  <slot v-if="!loading"/>
  <template v-else>
    <slot name="loading">
      <veui-icon
        class="veui-button-loading-icon"
        :name="icons.loading"
        spin
      />
      <slot/>
    </slot>
  </template>
</button>
</template>

<script>
import { omit } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import { hasClass } from '../utils/dom'

export default {
  name: 'veui-button',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui, focusable],
  props: {
    disabled: Boolean,
    name: String,
    type: {
      type: String,
      default: 'button'
    },
    value: String,
    loading: Boolean
  },
  data () {
    return {
      focusVisible: false
    }
  },
  computed: {
    attrs () {
      let props = omit(this.$props, 'loading')
      props.disabled = this.disabled || this.loading
      return props
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    },
    /**
     * Special hack to prevent state lost
     * upon component rerender
     */
    handleFocus () {
      this.$nextTick(() => {
        if (hasClass(this.$el, 'focus-visible')) {
          this.focusVisible = true
        }
      })
    },
    handleBlur () {
      this.focusVisible = false
    }
  }
}
</script>
