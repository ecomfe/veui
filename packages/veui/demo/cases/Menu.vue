<template>
<article class="veui-menu-demo">
  <h1><code>&lt;veui-menu&gt;</code></h1>
  <div>expanded: {{ expanded }}</div>
  <div>active: {{ active1 }}</div>
  <section>
    <h3>small menu</h3>
    <veui-menu
      ui="s"
      :items="items"
      :expanded.sync="expanded"
      :collapsible="false"
    />
  </section>
  <section>
    <h3>medium collapsible menu</h3>
    <veui-menu
      :items="items"
      :active.sync="active1"
      :expanded.sync="expanded"
      :collapsible="true"
    />
  </section>
  <section>
    <h3>large collapsible menu</h3>
    <veui-menu
      ui="l"
      :items="items"
      :active.sync="active2"
      :expanded.sync="expanded"
      :collapsible="true"
    />
  </section>
  <section><router-view/></section>
</article>
</template>

<script>
import { Menu } from 'veui'
import 'veui-theme-one-icons/android'
import 'veui-theme-one-icons/apple-f'
import 'veui-theme-one-icons/baidu'
import 'veui-theme-one-icons/bug'

export default {
  name: 'veui-menu-demo',
  components: {
    'veui-menu': Menu
  },
  data () {
    return {
      expanded: [],
      active1: '一级导航1',
      active2: undefined,
      items: [
        {
          label: '一级导航1',
          name: '一级导航1',
          icon: 'android',
          children: [
            {
              label: '二级导航11',
              name: '二级导航11',
              children: [
                {
                  label: 'Input',
                  to: '/menu/input'
                },
                {
                  label: 'Progress',
                  to: '/menu/progress'
                }
              ]
            },
            {
              label: '二级导航12',
              name: '二级导航12',
              children: [
                {
                  label: 'Link121',
                  to: 'Link121'
                },
                {
                  label: 'Link122',
                  to: 'Link122'
                }
              ]
            }
          ]
        },
        {
          label: 'Button',
          name: 'Button',
          to: '/menu/button',
          icon: 'apple-f',
          children: [
            {
              label: 'Loading',
              name: 'Loading',
              to: '/menu/loading',
              disabled: true,
              children: [
                {
                  label: 'Link',
                  name: 'Link',
                  to: '/menu/link'
                }
              ]
            }
          ]
        },
        {
          label: '一级导航3',
          name: '一级导航3',
          icon: 'baidu'
        },
        {
          label: '一级导航4',
          name: '一级导航4',
          icon: 'bug',
          disabled: true
        }
      ]
    }
  }
}
</script>

<style lang="less"></style>
