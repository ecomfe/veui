<template>
  <article>
    <h1><code>&lt;veui-alert&gt;</code></h1>
    <p>
      <div>固定提示</div>
      <veui-alert type="success" message="恭喜你，你的请求已成功处理" @update:open="close"></veui-alert>
      <veui-alert class="limit-width" type="success" message="恭喜你，你的请求已成功处理" @update:open="close"></veui-alert>
      <veui-alert type="warning" message="警告，进行检查，有风险信息存在" @update:open="close"></veui-alert>
      <veui-alert class="limit-width" type="warning" :message="messages" @update:open="close"></veui-alert>
      <veui-alert type="info" message="提醒，这个消息需要注意" @update:open="close"></veui-alert>
      <veui-alert class="limit-width" type="info" message="提醒，这个消息需要注意" @update:open="close" close-text="不再提示"></veui-alert>
      <veui-alert type="error" message="错误，请检查并修改后再进行操作" @update:open="close"></veui-alert>
      <veui-alert class="limit-width" type="error" message="错误，请检查并修改后再进行操作" @update:open="close"></veui-alert>
      <veui-dialog
          title="提示"
          :open="open"
          @update:open="open = !open"
          :draggable="true">
          您关闭了
          <template slot="foot"></template>
      </veui-dialog>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import { Alert, Dialog, Button, Icon } from 'veui'

export default {
  name: 'alert',
  components: {
    'veui-alert': Alert,
    'veui-dialog': Dialog,
    'veui-button': Button,
    'veui-icon': Icon
  },
  data () {
    return {
      open: false,
      messages: [
        '我是消息1我是消息1我是消息1我是消息1',
        '我是消息2',
        '我是消息3',
        '我是消息4',
        '我是消息5'
      ],
      messageIndex: 0
    }
  },
  methods: {
    close () {
      this.open = true
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  }
}
</script>

<style scoped>
p {
  margin: 30px;
}
.veui-alert.limit-width {
  width: 350px;
}

.nav-counter {
  margin-right: 10px;
}
</style>
