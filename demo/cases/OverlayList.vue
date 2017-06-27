<template>
  <div class="demo-overlay-list">
    <article>
      <h1><code>&lt;veui-overlay-list&gt;</code></h1>
      <section>
        <veui-button @click="popupAlerts">弹出一堆 AlertBox</veui-button>
        <veui-overlay-list
          :alerts="alerts">
        </veui-overlay-list>
      </section>
      <section>
        <veui-button @click="popupConfirms">弹出 ConfirmBox</veui-button>
        <veui-overlay-list
          :confirms="confirms">
        </veui-overlay-list>
      </section>
      <section>
        <veui-button @click="popupToasts">开始弹 toasts</veui-button>
        <veui-overlay-list
          :toasts="toasts">
        </veui-overlay-list>
      </section>
    </article>
  </div>
</template>

<script>
import OverlayList from '@/components/OverlayList'
import Button from '@/components/Button'

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
      this.alerts = [
        {
          type: 'success'
        },
        {
          type: 'error'
        },
        {
          type: 'info'
        }
      ]
    },
    popupConfirms () {
      this.confirms = [
        {
          title: '确认',
          content: '确定要删除？',
          ok ({ close }) {
            alert('确定了删除')
            close()
          }
        }
      ]
    },
    popupToasts () {
      let counter = 1
      setInterval(() => {
        counter++
        const type = ['error', 'info', 'success'][counter % 3]
        this.toasts = [
          {
            message: `${type}-${counter}`,
            type
          }
        ]
      }, 1000)
      // this.toasts = [
      //   {
      //     message: 'error',
      //     type: 'error'
      //   },
      //   {
      //     message: 'info',
      //     type: 'info'
      //   },
      //   {
      //     message: 'success',
      //     type: 'success'
      //   }
      // ]
    }
  }
}
</script>

<style lang="less">
</style>
