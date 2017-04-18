<template>
  <article>
    <h1><code>&lt;veui-alert&gt;</code></h1>
    <p>
      <div>固定提示</div>
      <veui-alert type="success" text="恭喜你，你的请求已成功处理" @update:open="close"></veui-alert>
      <veui-alert type="success" text="恭喜你，你的请求已成功处理" @update:open="close" width="300px"></veui-alert>
      <veui-alert type="warn" text="警告，进行检查，有风险信息存在" @update:open="close"></veui-alert>
      <veui-alert type="warn" text="警告，进行检查，有风险信息存在" @update:open="close" width="300px"></veui-alert>
      <veui-alert type="remind" text="提醒，这个消息需要注意" @update:open="close"></veui-alert>
      <veui-alert type="remind" text="提醒，这个消息需要注意" @update:open="close" width="300px" close-text="不在提示"></veui-alert>
      <veui-alert type="error" text="错误，请检查并修改后再进行操作" @update:open="close"></veui-alert>
      <veui-alert type="error" text="错误，请检查并修改后再进行操作" @update:open="close" width="300px"></veui-alert>
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
import Alert from '@/components/Alert'
import Dialog from '@/components/Dialog'

export default {
  name: 'alert',
  components: {
    'veui-alert': Alert,
    'veui-dialog': Dialog
  },
  data () {
    return {
      open: false
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
</style>
