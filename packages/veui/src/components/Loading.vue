<template>
<div
  v-if="loading"
  class="veui-loading"
>
  <veui-span
    class="veui-loading-spinner"
    :ui="realUi"
  >
    <slot name="spinner">
      <veui-icon
        spin
        :name="icons.loading"
      />
    </slot>
  </veui-span>
  <veui-span
    :ui="realUi"
    class="veui-loading-text"
  >
    <slot/>
  </veui-span>
</div>
</template>
<script>
import Icon from './Icon'
import Span from './Span'
import ui from '../mixins/ui'

export default {
  name: 'veui-loading',
  components: {
    'veui-icon': Icon,
    'veui-span': Span
  },
  mixins: [ui],
  props: {
    loading: Boolean
  }
}
</script>
