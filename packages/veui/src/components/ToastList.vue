<template>
<veui-overlay :open="true" :overlay-class="mergeOverlayClass('veui-toast-list')" :priority="priority">
  <veui-toast v-for="(message, index) in messages"
    open
    :key="message.__message_id__"
    :type="message.type"
    :message="message.message"
    :duration="message.duration"
    @close="remove(message)"
    @ready="updateHeight(message, index, $event)"
    :style="`top: ${message.top}px`">
  </veui-toast>
</veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Toast from './Toast'
import { assign, findIndex, uniqueId } from 'lodash'
import config from '../managers/config'
import overlay from '../mixins/overlay'

config.defaults({
  'toast.priority': 101
})

export default {
  name: 'toast-list',
  mixins: [overlay],
  components: {
    'veui-overlay': Overlay,
    'veui-toast': Toast
  },
  data () {
    return {
      messages: [],
      priority: config.get('toast.priority')
    }
  },
  methods: {
    add (message) {
      this.messages.unshift(assign({ height: 0, top: 0 }, message, {
        __message_id__: uniqueId('veui-toast-')
      }))
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
