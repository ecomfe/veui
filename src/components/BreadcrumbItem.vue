<template>
  <li class="veui-breadcrumb-item">
    <template v-if="$router && !native">
      <router-link :to="to"
        :replace="replace"
        :tag="{link: 'a', text: 'span'}[type]">
        <slot></slot>
      </router-link>
    </template>
    <template v-else>
      <a :href="to"
        @click="handleRedirect"
        v-if="type === 'link'">
        <slot></slot>
      </a>
      <span v-else><slot></slot></span>
    </template>
    <slot name="separator"></slot>
  </li>
</template>
<script>
import { includes } from 'lodash'

export default {
  name: 'veui-breadcrumb-item',
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
        return includes(['link', 'text'], value)
      }
    },
    native: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleRedirect (event) {
      if (this.to) {
        this.$emit('redirect', event)

        if (this.replace && !event.defaultPrevented) {
          event.preventDefault()
          location.replace(this.to)
        }
      } else {
        event.preventDefault()
        this.$emit('redirect', event)
      }
    }
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
