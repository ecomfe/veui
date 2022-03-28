<template>
<div
  :class="{
    [$c('message')]: true,
    [$c(`message-${status}`)]: true,
    [$c(`message-${display}`)]: true
  }"
  :ui="realUi"
>
  <veui-icon
    v-if="icons[status] && display !== 'simple'"
    ref="icon"
    :class="$c('message-icon')"
    :name="icons[status]"
  />
  <veui-popover
    v-if="display === 'popup'"
    target="icon"
    position="right"
  ><slot/></veui-popover>
  <div
    v-else
    :class="$c('message-content')"
  ><slot/></div>
</div>
</template>

<script>
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import { includes } from 'lodash'
import Icon from './Icon'
import Popover from './Popover'

export default {
  name: 'veui-message',
  components: {
    'veui-icon': Icon,
    'veui-popover': Popover
  },
  mixins: [prefix, ui],
  props: {
    status: {
      type: String,
      validator (val) {
        return includes(['success', 'error', 'info', 'warning', 'aux'], val)
      },
      default: 'success'
    },
    display: {
      type: String,
      validator (val) {
        return includes(['normal', 'popup', 'simple', 'standalone'], val)
      },
      default: 'normal'
    }
  }
}
</script>
