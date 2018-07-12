<template>
<button class="veui-button" :class="{
    'veui-button-loading': loading,
    'veui-disabled': disabled
  }" v-bind="attrs" v-on="listeners">
  <template v-if="!loading"><slot/></template>
  <template v-else>
    <slot name="loading">
      <veui-icon :name="icons.loading" spin/>
      <span class="veui-button-loading-text"><slot/></span>
    </slot>
  </template>
</button>
</template>

<script>
import { omit } from 'lodash'
import Icon from './Icon'
import ui from '../mixins/ui'
import { getListeners } from '../utils/helper'

const EVENTS = ['mousedown', 'mouseup', 'click', 'keydown', 'keyup', 'keypress', 'focus', 'blur']

export default {
  name: 'veui-button',
  mixins: [ui],
  components: {
    'veui-icon': Icon
  },
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
