<template>
<component v-if="!to"
  class="veui-link"
  :class="klass"
  :is="fallback"
  @click="handleRedirect"><slot :disabled="disabled"></slot></component>
<router-link v-else-if="$router && !native"
  class="veui-link"
  :class="klass"
  :to="to"
  :replace="replace">
  <slot></slot>
</router-link>
<a v-else
  class="veui-link"
  :class="klass"
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
    replace: Boolean,
    native: Boolean,
    fallback: {
      type: String,
      default: 'span'
    },
    disabled: Boolean
  },
  computed: {
    klass () {
      return {
        'veui-disabled': this.disabled
      }
    }
  },
  methods: {
    handleRedirect (event) {
      if (this.disabled) {
        event.preventDefault()
        return
      }
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
