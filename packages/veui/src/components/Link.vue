<template>
<component v-if="!to"
  class="veui-link"
  :is="fallback"
  @click="handleRedirect"><slot></slot></component>
<router-link v-else-if="$router && !native"
  class="veui-link"
  :to="to"
  :replace="replace">
  <slot></slot>
</router-link>
<a v-else
  class="veui-link"
  :href="to"
  @click="handleRedirect">
  <slot></slot>
</a>
</template>
<script>
export default {
  name: 'veui-link',
  components: {
    'veui-element': Element
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
    native: {
      type: Boolean,
      default: false
    },
    fallback: {
      type: String,
      default: 'span'
    }
  },
  methods: {
    handleRedirect (event) {
      if (this.to) {
        this.$emit('click', event)

        if (this.replace && !event.defaultPrevented) {
          event.preventDefault()
          location.replace(this.to)
        }
      } else {
        event.preventDefault()
        this.$emit('click', event)
      }
    }
  }
}
</script>
