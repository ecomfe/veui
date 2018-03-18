<template>
<li class="veui-breadcrumb-item">
  <veui-link v-if="type === 'link'"
    ui="link primary"
    @click="$emit('redirect', $event)"
    :to="to"
    :replace="replace"
    :native="native"><slot></slot></veui-link>
  <span v-else class="veui-breadcrumb-item-current"><slot></slot></span>
  <slot name="separator"></slot>
</li>
</template>

<script>
import { includes } from 'lodash'
import Link from './Link'

const ALLOWED_LINK_TYPES = ['link', 'text']

export default {
  name: 'veui-breadcrumb-item',
  components: {
    'veui-link': Link
  },
  props: {
    to: String,
    // TODO: 提供replace这个属性缺少实际use case？
    replace: Boolean,
    type: {
      type: String,
      default: 'link',
      validator (value) {
        return includes(ALLOWED_LINK_TYPES, value)
      }
    },
    native: Boolean
  }
}
</script>
