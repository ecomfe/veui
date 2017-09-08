<template>
  <article>
    <h1><code>&lt;veui-breadcrumb&gt;</code></h1>
    <p>
      <veui-breadcrumb :routes="items" @redirect="handleRedirect">
        <template scope="scope"><em>{{ scope.route.text }}</em></template>
        <template slot="separator" scope="scope"><veui-icon name="angle-double-right"></veui-icon></template>
      </veui-breadcrumb>
    </p>
    <p>
      <veui-breadcrumb :routes="items" @redirect="handleRedirect"></veui-breadcrumb>
    </p>
  </article>
</template>

<script>
import { Breadcrumb, Icon } from 'veui'
import 'veui/icons/angle-double-right'

export default {
  name: 'breadcrumb-demo',
  components: {
    'veui-breadcrumb': Breadcrumb,
    'veui-icon': Icon
  },
  data () {
    return {
      items: [
        { to: 'http://www.baidu.com', text: 'baidu', native: true },
        { to: '/steps', text: '步骤条组件' },
        { text: '监听跳转事件', native: true },
        { to: 'http://www.baidu.com', text: '阻止跳转事件', native: true },
        { to: 'http://www.baidu.com', text: 'replace', replace: true, native: true },
        { to: '/dialog', text: 'Dialog' },
        { to: 'http://jn.baidu.com', text: 'jn' }
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
