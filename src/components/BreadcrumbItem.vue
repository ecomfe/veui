<template>
  <li class="veui-breadcrumb-item">
    <hyper-link v-if="type === 'link'" @redirect="$emit('redirect', $event)"
      :to="to" :replace="replace" :native="native"><slot></slot></hyper-link>
    <span v-else><slot></slot></span>
    <slot name="separator"></slot>
  </li>
</template>
<script>
import { includes } from 'lodash'
import HyperLink from './HyperLink'

const ALLOWED_LINK_TYPES = ['link', 'text']

export default {
  name: 'veui-breadcrumb-item',
  components: {
    HyperLink
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
  },
  methods: {

  }
}
</script>
<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-breadcrumb-item {
  float: left;
}

.veui-breadcrumb-item-link {
  cursor: pointer;
  color: @veui-theme-color-primary;
}
</style>
