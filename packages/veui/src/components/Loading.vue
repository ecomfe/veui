<template>
<div
  v-if="loading"
  :ui="realUi"
  :class="$c('loading')"
>
  <div
    :ui="realUi"
    :class="$c('loading-spinner')"
  >
    <slot name="spinner">
      <veui-icon
        spin
        :name="icons.loading"
      />
    </slot>
  </div>
  <div
    v-if="$slots.default"
    :ui="realUi"
    :class="$c('loading-text')"
  >
    <slot/>
  </div>
</div>
</template>
<script>
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'

export default {
  name: 'veui-loading',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui],
  props: {
    loading: Boolean
  }
}
</script>
