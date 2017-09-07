<template>
<div :ui="ui" class="veui-toast" :class="`veui-toast-${type}`">
  <veui-icon class="veui-toast-icon" :name="`${iconName}-circle`"></veui-icon>
  <span class="veui-toast-message">{{ message }}</span>
</div>
</template>

<script>
import Icon from './Icon'
import '../icons/check-circle'
import '../icons/exclamation-circle'
import '../icons/info-circle'
import '../icons/cross-circle'

const ICON_MAP = {
  success: 'check',
  warning: 'exclamation',
  info: 'info',
  error: 'cross'
}

export default {
  name: 'toast',
  components: {
    'veui-icon': Icon
  },
  props: {
    ui: String,
    type: {
      type: String,
      default: 'success'
    },
    message: String,
    duration: {
      type: Number,
      default: 3000
    }
  },
  computed: {
    iconName () {
      return ICON_MAP[this.type]
    }
  },
  mounted () {
    this.timer = setTimeout(() => {
      this.$emit('close')
    }, this.duration)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
