<template>
<veui-overlay
  open
  :overlay-class="mergeOverlayClass($c('toast-list'))"
  :priority="priority"
>
  <veui-toast
    v-for="(message, index) in messages"
    :key="message.__message_id__"
    open
    :type="message.type"
    :message="message.message"
    :closable="message.closable"
    :title="message.title"
    :ui="message.ui"
    :duration="message.duration"
    :style="`top: ${message.top}px`"
    @close="remove(message)"
    @ready="updateHeight(message, index, $event)"
  />
</veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Toast from './Toast'
import { assign, findIndex, uniqueId } from 'lodash'
import config from '../managers/config'
import prefix from '../mixins/prefix'
import overlay from '../mixins/overlay'

config.defaults({
  'toast.priority': 101
})

export default {
  name: 'toast-list',
  components: {
    'veui-overlay': Overlay,
    'veui-toast': Toast
  },
  mixins: [prefix, overlay],
  data () {
    return {
      messages: [],
      priority: config.get('toast.priority')
    }
  },
  methods: {
    add (message) {
      this.messages.unshift(
        assign({ height: 0, top: 0 }, message, {
          __message_id__: uniqueId('veui-toast-')
        })
      )
    },
    remove (message) {
      let index = findIndex(this.messages, msg => {
        return msg.__message_id__ === message.__message_id__
      })
      this.messages.splice(index, 1)
      this.updateLayout()
    },
    updateHeight (message, index, height) {
      message.height = height
      this.updateLayout()
    },
    updateLayout () {
      this.messages.forEach((msg, i) => {
        if (i === 0) {
          msg.top = 0
          return
        }

        let prev = this.messages[i - 1]
        msg.top = prev.top + prev.height + 10
      })
    }
  }
}
</script>
