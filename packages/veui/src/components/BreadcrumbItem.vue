<template>
<li :class="$c('breadcrumb-item')">
  <veui-link
    v-if="type === 'link'"
    :ui="uiParts.link"
    :to="to"
    :replace="replace"
    :native="native"
    tabindex="0"
    @click="$emit('redirect', $event)"
  >
    <slot/>
  </veui-link>
  <span
    v-else
    :class="$c('breadcrumb-item-current')"
  >
    <slot/>
  </span>
  <span :class="$c('breadcrumb-separator')">
    <slot name="separator">
      <veui-icon
        v-if="icons.separator"
        :name="icons.separator"
      />
    </slot>
  </span>
</li>
</template>

<script>
import { includes } from 'lodash'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import Link from './Link'
import Icon from './Icon'

const ALLOWED_LINK_TYPES = ['link', 'text']

export default {
  name: 'veui-breadcrumb-item',
  components: {
    'veui-link': Link,
    'veui-icon': Icon
  },
  mixins: [prefix, ui],
  props: {
    to: [String, Object],
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
