<template>
<article>
  <h1><code>&lt;veui-breadcrumb&gt;</code></h1>
  <section>
    <veui-button @click="next">
      Switch separator
    </veui-button>
  </section>
  <section>
    <h4>自定义加粗</h4>
    <veui-breadcrumb
      :routes="items"
      @redirect="handleRedirect"
    >
      <template
        slot="item"
        slot-scope="route"
      >
        <em>{{ route.label }}</em>
      </template>
      <template slot="separator">
        {{ sep }}
      </template>
    </veui-breadcrumb>
  </section>
  <section>
    <h4>加强型</h4>
    <veui-breadcrumb
      :routes="items"
      ui="strong"
      @redirect="handleRedirect"
    />
  </section>
  <section>
    <h4><code>ui="s"</code></h4>
    <veui-breadcrumb
      :routes="items"
      ui="s"
      @redirect="handleRedirect"
    />
  </section>
  <section>
    <h4>内联模式</h4>
    <veui-breadcrumb>
      <veui-breadcrumb-item to="/">
        首页
      </veui-breadcrumb-item>
      <veui-breadcrumb-item :to="{ name: 'Breadcrumb' }">
        面包屑
      </veui-breadcrumb-item>
      <veui-breadcrumb-item type="text">
        我在这里
      </veui-breadcrumb-item>
    </veui-breadcrumb>
  </section>
</article>
</template>

<script>
import { Button, Breadcrumb, BreadcrumbItem } from 'veui'

export default {
  name: 'breadcrumb-demo',
  components: {
    'veui-button': Button,
    'veui-breadcrumb': Breadcrumb,
    'veui-breadcrumb-item': BreadcrumbItem
  },
  data () {
    return {
      index: 0,
      seps: ['/', '👉', '➡️', '➜', '➞', '☞'],
      items: [
        { to: 'http://www.baidu.com', label: 'baidu', native: true },
        { to: '/steps', label: '步骤条组件' },
        { label: '监听跳转事件', native: true },
        { to: 'http://www.baidu.com', label: '阻止跳转事件', native: true },
        {
          to: 'http://www.baidu.com',
          label: 'replace',
          replace: true,
          native: true
        },
        { to: '/dialog', label: 'Dialog' },
        { to: 'http://jn.baidu.com', label: 'jn' }
      ]
    }
  },
  computed: {
    sep () {
      return this.seps[this.index]
    }
  },
  methods: {
    next () {
      this.index = (this.index + 1) % this.seps.length
    },
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

<style lang="less" scoped>
section {
  margin-bottom: 20px;
}
</style>
