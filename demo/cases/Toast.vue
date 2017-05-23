<template>
  <article>
    <h1><code>&lt;veui-toast&gt;</code></h1>
    <p>
      <div class="toast-title">全局提示</div>
      <veui-button ui="aux" @click="showToast('all')">全部</veui-button>
      <veui-button ui="aux" @click="showToast('success')">成功</veui-button>
      <veui-button ui="aux" @click="showToast('warning')">警告</veui-button>
      <veui-button ui="aux" @click="showToast('info')">提醒</veui-button>
      <veui-button ui="aux" @click="showToast('error')">错误</veui-button>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
// import {toast} from '@/managers/toast'
import {ToastManager} from '@/managers/toast'
import Button from '@/components/Button'

let toast = new ToastManager()
let msg = [
  {
    type: 'success',
    message: '恭喜您，您的请求已成功处理',
    duration: 2500
  },
  {
    type: 'warning',
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
        toast.add(this.msg)
      } else {
        toast.add(this.msgMap[type])
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
