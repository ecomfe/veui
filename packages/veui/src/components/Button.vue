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
  v-on="listeners"
  @focus="handleFocus"
  @blur="handleBlur"
>
  <slot v-if="!loading"/>
  <template v-else>
    <slot name="loading">
      <veui-icon
        :name="icons.loading"
        spin
      />
      <span class="veui-button-loading-text">
        <slot/>
      </span>
    </slot>
  </template>
</button>
</template>

<script>
import { omit } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'
import focusable from '../mixins/focusable'
import { getListeners } from '../utils/helper'
import { hasClass } from '../utils/dom'

const EVENTS = [
  'mousedown',
  'mouseup',
  'mouseenter',
  'mouseleave',
  'click',
  'keydown',
  'keyup',
  'keypress',
  'focus',
  'blur'
]

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
    },
    listeners () {
      return getListeners(EVENTS, this)
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
