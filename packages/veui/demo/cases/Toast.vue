<template>
<article>
  <h1><code>&lt;veui-toast&gt;</code></h1>
  <section>
    <div class="toast-title">
      全局提示
    </div>
    <veui-button
      ui="aux"
      @click="showToast('all')"
    >
      全部
    </veui-button>
    <veui-button
      ui="aux"
      @click="showToast('success')"
    >
      成功
    </veui-button>
    <veui-button
      ui="aux"
      @click="showToast('warn')"
    >
      警告
    </veui-button>
    <veui-button
      ui="aux"
      @click="showToast('info')"
    >
      提醒
    </veui-button>
    <veui-button
      ui="aux"
      @click="showToast('error')"
    >
      错误
    </veui-button>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Button } from 'veui'
import toast from 'veui/managers/toast'

let messages = [
  {
    type: 'success',
    message: '恭喜您，您的请求已成功处理',
    duration: 2500
  },
  {
    type: 'warn',
    message: '警告，有法律风险存在',
    duration: 2000
  },
  {
    type: 'info',
    message: '提醒，请注意这个消息',
    duration: 1500
  },
  {
    type: 'error',
    message: '错误，请检查并修改后再提交',
    duration: 1000
  }
]

export default {
  name: 'toast',
  components: {
    'veui-button': Button
  },
  data () {
    return {
      messages: messages
    }
  },
  computed: {
    messageMap () {
      return this.messages.reduce((result, current) => {
        result[current.type] = current
        return result
      }, {})
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    showToast (type) {
      if (type === 'all') {
        messages.forEach(({ type, message, duration }) => {
          toast[type]({
            message,
            duration
          })
        })
      } else {
        toast[type](this.messageMap[type].message)
      }
    }
  }
}
</script>

<style scoped>
p {
  margin: 30px;
}
.toast-title {
  margin-bottom: 30px;
}
.veui-button {
  margin-right: 10px;
}
</style>
