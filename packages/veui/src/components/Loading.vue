<template>
<transition :name="$c('loading-bar')">
  <div
    v-if="loading"
    :ui="realUi"
    :class="$c('loading')"
    :aria-label="hasDefaultSlot() ? null : t('loading')"
    :aria-describedby="hasDefaultSlot() ? descId : null"
  >
    <div :class="$c('loading-spinner')" aria-hidden="true">
      <slot name="spinner">
        <veui-icon v-if="icons.loading" :name="icons.loading" spin/>
        <svg v-bind="attrs" v-html="contents"/>
      </slot>
    </div>
    <div v-if="hasDefaultSlot()" :id="descId" :class="$c('loading-text')">
      <slot/>
    </div>
  </div>
</transition>
</template>

<script>
import { uniqueId } from 'lodash'
import Icon from './Icon'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import { loadingContent as loading } from 'dls-graphics'
import '../common/global'

export default {
  name: 'veui-loading',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui, i18n],
  props: {
    loading: Boolean
  },
  data () {
    return {
      descId: uniqueId('veui-loading-')
    }
  },
  created () {
    this.contents = loading.contents

    let attrs = loading.attrs
    let { class: className, ...others } = attrs
    this.attrs = { class: [className, this.$c('loading-content')], ...others }
  },
  methods: {
    hasDefaultSlot () {
      return this.$slots.default
    }
  }
}
</script>

<style src="dls-graphics/dist/separate/loading.css"></style>
