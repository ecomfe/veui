<template>
<div>
  <veui-breadcrumb>
    <veui-breadcrumb-item @redirect="redirect">listen to redirect event</veui-breadcrumb-item>
    <veui-breadcrumb-item v-for="item in items"
      :key="item.to"
      :to="item.to">
      {{ item.text }}
    </veui-breadcrumb-item>
  </veui-breadcrumb>
</div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
import BreadcrumbItem from '@/components/BreadcrumbItem'

export default {
  components: {
    'veui-breadcrumb': Breadcrumb,
    'veui-breadcrumb-item': BreadcrumbItem
  },
  data () {
    return {
      items: [
        { to: 'http://www.baidu.com', text: 'baidu' },
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
    redirect () {
      alert('redirect')
    }
  }
}
</script>
<style lang="less">

</style>
