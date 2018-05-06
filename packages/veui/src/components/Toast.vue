<template>
<transition name="veui-toast">
  <div :ui="ui" class="veui-toast" :class="`veui-toast-${type}`">
    <veui-icon class="veui-toast-icon" :name="icons[type]"/>
    <span class="veui-toast-message">{{ message }}</span>
  </div>
</transition>
</template>

<script>
import Icon from './Icon'
import ui from '../mixins/ui'
import { includes } from 'lodash'

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
    duration: {
      type: Number,
      default: 3000
    }
  },
  mounted () {
    this.timer = setTimeout(() => {
      this.$emit('close')
    }, this.duration)

    this.$emit('ready', this.$el.offsetHeight)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
