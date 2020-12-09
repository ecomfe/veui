<template>
<div
  v-if="loading"
  :ui="realUi"
  :class="$c('loading')"
>
  <div :class="$c('loading-spinner')">
    <slot name="spinner">
      <veui-icon
        v-if="icons.loading"
        :name="icons.loading"
        spin
      />
      <svg
        v-bind="attrs"
        v-html="contents"
      />
    </slot>
  </div>
  <div
    v-if="$slots.default"
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
import { loadingContent as loading } from 'dls-graphics'

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

    let attrs = loading.attrs
    let { class: className, ...others } = attrs
    this.attrs = { class: [className, this.$c('loading-content')], ...others }
  }
}
</script>

<style src="dls-graphics/dist/separate/loading.css"></style>
