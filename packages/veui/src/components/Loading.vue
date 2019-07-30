<template>
<div
  v-if="loading"
  :ui="realUi"
  class="veui-loading"
>
  <div
    :ui="realUi"
    class="veui-loading-spinner"
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
    class="veui-loading-text"
  >
    <slot/>
  </div>
</div>
</template>
<script>
import Icon from './Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-loading',
  components: {
    'veui-icon': Icon
  },
  mixins: [ui],
  props: {
    loading: Boolean
  }
}
</script>
