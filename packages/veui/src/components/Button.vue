<template>
<button class="veui-button" :class="{
    'veui-button-loading': loading,
    'veui-disabled': disabled
  }" v-bind="attrs" @click="$emit('click', $event)">
  <template v-if="!loading"><slot></slot></template>
  <template v-else>
    <slot name="loading">
      <veui-icon :name="icons.loading" spin></veui-icon>
      <span class="veui-button-loading-text">加载中…</span>
    </slot>
  </template>
</button>
</template>

<script>
import { omit } from 'lodash'
import Icon from './Icon'
import { icons } from '../mixins'

export default {
  name: 'veui-button',
  mixins: [icons],
  components: {
    'veui-icon': Icon
  },
  props: {
    ui: String,
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
    }
  },
  methods: {
    focus () {
      this.$el.focus()
    }
  }
}
</script>
