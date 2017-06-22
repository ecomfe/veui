<template>
  <li class="veui-breadcrumb-item">
    <veui-link v-if="type === 'link'"
      @click="$emit('redirect', $event)"
      :to="to"
      :replace="replace"
      :native="native"><slot></slot></veui-link>
    <span v-else><slot></slot></span>
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
    to: {
      type: String,
      default: ''
    },
    replace: {
      type: Boolean,
      default: false
    },
    type: {
      default: 'link',
      validator (value) {
        return includes(ALLOWED_LINK_TYPES, value)
      }
    },
    native: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-breadcrumb-item {
  float: left;
  line-height: 20px;

  a {
    text-decoration: none;
  }
}
</style>
