<template>
  <veui-overlay :open="true" overlay-class="veui-toast-list" :priority="priority">
    <veui-toast v-for="(message, index) in messages"
      v-bind="message"
      :key="message.__message_id__"
      @close="remove(message)">
    </veui-toast>
  </veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Toast from './Toast'
import { assign, findIndex, uniqueId } from 'lodash'
import { config } from '../managers'

config.defaults({
  'toast.priority': 101
})

export default {
  name: 'toast-list',
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
      this.messages.unshift(assign({}, message, {
        __message_id__: uniqueId('veui-toast-')
      }))
    },
    remove (message) {
      this.messages.splice(findIndex(this.messages, msg => {
        return msg.__message_id__ === message.__message_id__
      }), 1)
    }
  }
}
</script>
