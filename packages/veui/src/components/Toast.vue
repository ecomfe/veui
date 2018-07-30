<template>
<transition name="veui-toast">
  <div
    v-if="open"
    :ui="ui"
    class="veui-toast"
    :class="`veui-toast-${type}`"
    role="alert">
    <veui-icon class="veui-toast-icon" :name="icons[type]"/>
    <span class="veui-toast-message"><slot>{{ message }}</slot></span>
  </div>
</transition>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'
import config from '../managers/config'
import { includes } from 'lodash'

config.defaults({
  duration: 3000
}, 'toast')

const TYPE_LIST = ['success', 'warning', 'info', 'error']

export default {
  name: 'toast',
  mixins: [ui],
  components: {
    'veui-icon': Icon
  },
  props: {
    type: {
      type: String,
      default: 'success',
      validator (val) {
        return includes(TYPE_LIST, val)
      }
    },
    message: String,
    open: Boolean,
    duration: {
      type: Number,
      default: config.get('toast.duration')
    }
  },
  mounted () {
    this.timer = setTimeout(() => {
      this.$emit('update:open', false)
      this.$emit('close')
    }, this.duration)

    this.$emit('ready', this.$el.offsetHeight)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
