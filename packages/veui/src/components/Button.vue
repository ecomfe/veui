<template>
<button class="veui-button" :class="{
    'veui-button-loading': loading,
    'veui-disabled': disabled
  }" v-bind="attrs" @click="$emit('click', $event)">
  <template v-if="!loading"><slot></slot></template>
  <template v-else>
    <slot name="loading">
      <icon name="loading" spin></icon>
      <span class="veui-button-loading-text">加载中…</span>
    </slot>
  </template>
</button>
</template>

<script>
import { omit } from 'lodash'
import Icon from './Icon'
import '../icons/loading'

export default {
  name: 'veui-button',
  components: {
    Icon
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
    autofocus: Boolean,
    loading: Boolean
  },
  computed: {
    attrs () {
      let attrs = omit(this.$props, 'loading')
      attrs.disabled = this.disabled || this.loading
      return attrs
    }
  }
}
</script>
