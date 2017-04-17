<template>
  <router-link v-if="$router && !native"
    :to="to"
    :replace="replace">
    <slot></slot>
  </router-link>
  <a v-else
    :href="to"
    @click="handleRedirect">
    <slot></slot>
  </a>
</template>
<script>
export default {
  name: 'veui-hyper-link',
  props: {
    to: {
      type: String,
      default: ''
    },
    replace: {
      type: Boolean,
      default: false
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
