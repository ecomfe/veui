<template>
<component
  :is="fallback"
  v-if="!to"
  :class="klass"
  :ui="realUi"
  :aria-disabled="disabled"
  @click="handleRedirect"
>
  <slot/>
</component>
<router-link
  v-else-if="$router && !native"
  :class="klass"
  :to="to"
  :rel="realRel"
  :target="target"
  :ui="realUi"
  :aria-disabled="disabled"
  :replace="replace"
  v-bind="disabled ? { event: null } : {}"
  @click.native="handleNativeClick"
>
  <slot/>
</router-link>
<a
  v-else
  :class="klass"
  :href="to"
  :rel="realRel"
  :target="target"
  :ui="realUi"
  :aria-disabled="disabled"
  @click="handleRedirect"
>
  <slot/>
</a>
</template>

<script>
import { uniq } from 'lodash'
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
    disabled: Boolean,
    rel: String,
    target: String
  },
  computed: {
    klass () {
      return {
        'veui-link': true,
        'veui-disabled': this.disabled
      }
    },
    realRel () {
      if (this.target && this.target.toLowerCase() === '_blank') {
        return uniq([...(this.rel || '').split(/\s+/), 'noopener'].filter(t => t)).join(' ')
      }
      return this.rel
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
    },
    handleNativeClick (event) {
      if (this.disabled) {
        return
      }
      this.$emit('click', event)
    }
  }
}
</script>
