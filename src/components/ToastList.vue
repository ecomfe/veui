<template>
  <veui-overlay :open="true" overlay-class="veui-toast-list" >
    <template v-for="message in messages">
      <veui-toast v-bind="message" :key="message.__message_id__" @close="remove(message)"></veui-toast>
    </template>
  </veui-overlay>
</template>

<script>
import Overlay from './Overlay'
import Toast from './Toast'
import { assign, findIndex, uniqueId } from 'lodash'

export default {
  name: 'toast-list',
  components: {
    'veui-overlay': Overlay,
    'veui-toast': Toast
  },
  data () {
    return {
      messages: []
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

<style lang="less">
@import "../styles/theme-default/lib.less";
.veui-toast-list {
  position: absolute;
  left: 50%;
  top: @nav-bar-height + 15px;
  transform: translateX(-50%);
  background-color: fadeOut(#000, 100%);
  .veui-toast {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
