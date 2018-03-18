<template>
<component v-if="!to"
  :class="klass"
  :is="fallback"
  :ui="ui"
  @click="handleRedirect"><slot></slot></component>
<router-link v-else-if="$router && !native"
  :class="klass"
  :to="to"
  :ui="ui"
  :replace="replace">
  <slot></slot>
</router-link>
<a v-else
  :class="klass"
  :href="to"
  :ui="ui"
  @click="handleRedirect">
  <slot></slot>
</a>
</template>

<script>
import ui from '../mixins/ui'

export default {
  name: 'veui-link',
  mixins: [ui],
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
        'veui-link': true,
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
