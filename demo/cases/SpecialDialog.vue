<template>
  <div class="demo-special-dialog">
    <article>
      <h1><code>&lt;veui-special-dialog&gt;</code></h1>
      <section>
        <veui-button @click="popupAlerts">弹出一堆 AlertBox</veui-button>
      </section>
      <section>
        <veui-button @click="popupConfirms">弹出 ConfirmBox</veui-button>
      </section>
      <section>
        <veui-button @click="popupToasts">开始弹 toasts</veui-button>
      </section>
      <section>
        <veui-button @click="popupPrompt">prompt</veui-button>
      </section>
    </article>
  </div>
</template>

<script>
import Button from '@/components/Button'
import alertManager from '@/managers/alert'
import confirmManager from '@/managers/confirm'
import promptManager from '@/managers/prompt'
import toastManager from '@/managers/toast'

export default {
  components: {
    'veui-button': Button
  },
  data () {
    return {
      alerts: [],
      confirms: [],
      toasts: []
    }
  },
  methods: {
    popupAlerts () {
      alertManager.success('成功了', '成功标题', {
        ok () {
          alert('祝贺你成功了！')
        }
      })
      alertManager.info('提示信息', '提示标题')
      alertManager.error('出错了', '出错标题')
    },
    popupConfirms () {
      confirmManager.popup('真的要删除吗？删除之后不能恢复！', '确认一下', {
        ok () {
          alert('原来你真的想要删除！')
        }
      })
    },
    popupToasts () {
      let counter = 1
      setInterval(() => {
        counter++
        const type = ['error', 'info', 'success'][counter % 3]
        toastManager[type](`${type}-${counter}`)
      }, 1000)
    },
    popupPrompt () {
      promptManager.popup('content', 'title', {
        content: 'content',
        title: 'title',
        ok (value) {
          alert(value)
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
