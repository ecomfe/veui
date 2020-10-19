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
        v-if="icons.loading"
        :name="icons.loading"
        spin
      />
      <svg
        v-bind="attrs"
        :class="$c('loading-content')"
        v-html="contents"
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
import { loading } from 'dls-graphics/dist/separate'

export default {
  name: 'veui-loading',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui],
  props: {
    loading: Boolean
  },
  created () {
    this.contents = loading.contents
    this.attrs = loading.attrs
  }
}
</script>

<style src="dls-graphics/dist/separate/loading.css"></style>
