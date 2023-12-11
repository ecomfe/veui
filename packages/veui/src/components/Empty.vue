<template>
<div :class="$c('empty')" :ui="realUi">
  <div
    v-if="(image !== null && image !== false) || $scopedSlots.default"
    :class="$c('empty-image')"
  >
    <slot name="default">
      <img v-if="image && typeof image === 'object'" v-bind="image">
      <component :is="illustrations.fallbackImage" v-else/>
    </slot>
  </div>
  <div v-if="title || $scopedSlots.title" :class="$c('empty-title')">
    <slot name="title">{{ title }}</slot>
  </div>
  <div
    v-if="
      (desc !== null && desc !== '' && desc !== false) || $scopedSlots.desc
    "
    :class="$c('empty-desc')"
  >
    <slot name="desc">{{ desc || t('noData') }}</slot>
  </div>
  <div v-if="$scopedSlots.actions" :class="$c('empty-actions')">
    <slot name="actions"/>
  </div>
</div>
</template>

<script>
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'

export default {
  name: 'veui-empty',
  mixins: [ui, i18n],
  props: {
    title: String,
    desc: {
      type: [String, Boolean],
      default: undefined
    },
    image: {
      type: [Object, Boolean],
      default: undefined
    }
  }
}
</script>
