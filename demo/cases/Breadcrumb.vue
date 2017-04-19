<template>
  <article>
    <h1><code>&lt;veui-breadcrumb&gt;</code></h1>
    <p>
      <veui-breadcrumb :routers="items" @redirect="handleRedirect">
        <template scope="scope">{{ scope.router.text }}</template>
        <template slot="separator">&gt;</template>
      </veui-breadcrumb>
    </p>
  </article>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    'veui-breadcrumb': Breadcrumb
  },
  data () {
    return {
      items: [
        { to: 'http://www.baidu.com', text: 'baidu', native: true },
        { to: 'http://brandplus.baidu.com', text: '开放服务平台', type: 'text', native: true },
        { text: '监听跳转事件', native: true },
        { to: 'http://www.baidu.com', text: '阻止跳转事件', native: true },
        { to: 'http://www.baidu.com', text: 'replace', replace: true, native: true },
        { to: '/dialog', text: 'Dialog' },
        { to: 'http://jn.baidu.com', text: 'jn' }
      ]
    }
  },
  created () {
    // setInterval(() => {
    //   this.items[0].text = Date.now()
    //   this.items[1].text = Date.now()
    // }, 1000)
  },
  methods: {
    handleRedirect (event, router, index) {
      if (index === 2) {
        alert('redirect event')
      } else if (index === 3) {
        event.preventDefault()
        alert('prevent redirect event')
      }
    }
  }
}
</script>
<style lang="less">

</style>
