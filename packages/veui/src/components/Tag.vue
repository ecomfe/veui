<template>
<div
  v-if="localOpen"
  :ui="ui"
  class="veui-tag"
  :class="`veui-tag-${type}`"
>
  <slot/>
  <veui-button
    v-if="closable"
    class="veui-tag-close"
    @click="close"
  >
    <veui-icon :name="icons.close"/>
  </veui-button>
</div>
</template>

<script>
import Button from './Button'
import Icon from './Icon'
import ui from '../mixins/ui'

export default {
  name: 'veui-tag',
  components: {
    'veui-button': Button,
    'veui-icon': Icon
  },
  mixins: [ui],
  props: {
    type: {
      type: String,
      default: 'default'
    },
    closable: Boolean
  },
  data () {
    return {
      localOpen: true
    }
  },
  methods: {
    close () {
      this.localOpen = false
      this.$emit('close')
    }
  }
}
</script>
