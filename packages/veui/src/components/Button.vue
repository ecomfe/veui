<template>
<button
  :class="{
    'veui-button': true,
    'veui-button-loading': loading,
    'veui-disabled': disabled
  }"
  :ui="realUi"
  v-bind="attrs"
  v-on="listeners"
>
  <template v-if="!loading">
    <slot/>
  </template>
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
import { getListeners } from '../utils/helper'

const EVENTS = [
  'mousedown', 'mouseup', 'mouseenter', 'mouseleave',
  'click', 'keydown', 'keyup', 'keypress', 'focus', 'blur'
]

export default {
  name: 'veui-button',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui],
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
  computed: {
    attrs () {
      let attrs = omit(this.$props, 'loading')
      attrs.disabled = this.disabled || this.loading
      return attrs
    },
    listeners () {
      return getListeners(EVENTS, this)
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    }
  }
}
</script>
