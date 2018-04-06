<template>
  <article>
    <h1><code>&lt;veui-breadcrumb&gt;</code></h1>
    <p>
      <veui-breadcrumb :routes="items" @redirect="handleRedirect">
        <template slot-scope="route"><em>{{ route.label }}</em></template>
        <template slot="separator" slot-scope="scope">/</template>
      </veui-breadcrumb>
    </p>
    <p>
      <veui-breadcrumb :routes="items" @redirect="handleRedirect"/>
    </p>
    <p>
      <veui-breadcrumb>
        <veui-breadcrumb-item to="/">首页</veui-breadcrumb-item>
        <veui-breadcrumb-item to="/breadcrumb">面包屑</veui-breadcrumb-item>
        <veui-breadcrumb-item type="text">我在这里</veui-breadcrumb-item>
      </veui-breadcrumb>
    </p>
  </article>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Icon } from 'veui'

export default {
  name: 'breadcrumb-demo',
  components: {
    'veui-breadcrumb': Breadcrumb,
    'veui-breadcrumb-item': BreadcrumbItem,
    'veui-icon': Icon
  },
  data () {
    return {
      items: [
        { to: 'http://www.baidu.com', label: 'baidu', native: true },
        { to: '/steps', label: '步骤条组件' },
        { label: '监听跳转事件', native: true },
        { to: 'http://www.baidu.com', label: '阻止跳转事件', native: true },
        { to: 'http://www.baidu.com', label: 'replace', replace: true, native: true },
        { to: '/dialog', label: 'Dialog' },
        { to: 'http://jn.baidu.com', label: 'jn' }
      ]
    }
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
