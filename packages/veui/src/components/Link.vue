<template>
<component v-if="!to"
  :class="klass"
  :is="fallback"
  :ui="realUi"
  :aria-disabled="String(disabled)"
  @click="handleRedirect"><slot/></component>
<router-link v-else-if="$router && !native"
  :class="klass"
  :to="to"
  :ui="realUi"
  :aria-disabled="String(disabled)"
  :replace="replace">
  <slot/>
</router-link>
<a v-else
  :class="klass"
  :href="to"
  :ui="realUi"
  :aria-disabled="String(disabled)"
  @click="handleRedirect">
  <slot/>
</a>
</template>

<script>
import ui from '../mixins/ui'

export default {
  name: 'veui-link',
  mixins: [ui],
  props: {
    to: {
      type: [String, Object],
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
