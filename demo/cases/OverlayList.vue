<template>
  <div class="demo-overlay-list">
    <article>
      <h1><code>&lt;veui-overlay-list&gt;</code></h1>
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
import OverlayList from '@/components/OverlayList'
import Button from '@/components/Button'
import overlayListManager from '@/managers/overlayList'

overlayListManager.init()

export default {
  components: {
    'veui-overlay-list': OverlayList,
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
      overlayListManager.alert('success')
      overlayListManager.alert('error', { content: '已经存在这样的名字了' })
      overlayListManager.alert('info', { content: '注意一点', ok () { alert('点击了ok') } })
    },
    popupConfirms () {
      overlayListManager.confirm({
        title: '确认一下',
        content: '真的要删除吗？删除之后不能恢复！',
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
        overlayListManager.toast(type, `${type}-${counter}`)
      }, 1000)
    },
    popupPrompt () {
      overlayListManager.prompt({
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
