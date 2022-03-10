<template>
<div
  :class="{
    [$c('message')]: true,
    [$c(`message-${type}`)]: true
  }"
>
  <veui-icon
    v-if="icons[type] && icon"
    :class="$c('message-icon')"
    :name="icons[type]"
  />
  <div :class="$c('message-content')"><slot/></div>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import { includes } from 'lodash'
import Icon from './Icon'

export default {
  name: 'veui-message',
  components: {
    'veui-icon': Icon
  },
  mixins: [prefix, ui],
  props: {
    type: {
      type: String,
      validator (val) {
        return includes(['success', 'error', 'info', 'warning'], val)
      },
      default: 'success'
    },
    icon: Boolean
  }
}
</script>
