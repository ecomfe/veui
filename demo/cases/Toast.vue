<template>
  <article>
    <h1><code>&lt;veui-toast&gt;</code></h1>
    <p>
      <div class="toast-title">全局提示</div>
      <veui-button ui="aux" @click="showToast('all')">全部</veui-button>
      <veui-button ui="aux" @click="showToast('success')">成功</veui-button>
      <veui-button ui="aux" @click="showToast('warn')">警告</veui-button>
      <veui-button ui="aux" @click="showToast('remind')">提醒</veui-button>
      <veui-button ui="aux" @click="showToast('error')">错误</veui-button>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import { add } from '@/managers/toast'
import Button from '@/components/Button'
let msg = [
  {
    type: 'success',
    text: '恭喜您，您的请求已成功处理',
    time: 2500
  },
  {
    type: 'warn',
    text: '警告，有法律风险存在',
    time: 2000
  },
  {
    type: 'remind',
    text: '提醒，请注意这个消息',
    time: 1500
  },
  {
    type: 'error',
    text: '错误，请检查并修改后再提交',
    time: 1000
  }
]

export default {
  name: 'toast',
  components: {
    'veui-button': Button
  },
  data () {
    return {
      msg: msg
    }
  },
  computed: {
    msgMap () {
      let map = {}
      this.msg.forEach(item => {
        map[item.type] = item
      })
      return map
    }
  },
  methods: {
    showToast (type) {
      if (type === 'all') {
        add(this.msg)
      } else {
        add(this.msgMap[type])
      }
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
.toast-title {
  margin-bottom: 30px;
}
.veui-button {
  margin-right: 10px
}
</style>
