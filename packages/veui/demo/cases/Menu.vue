<template>
<article class="veui-menu-demo">
  <h1><code>&lt;veui-menu&gt;</code></h1>
  <div>expanded: {{ expanded }}</div>
  <div>active: {{ active1 }}</div>
  <section>
    <h3>small collapsible menu</h3>
    <veui-menu
      class="small-menu"
      ui="s"
      :items="items"
      :expanded.sync="expanded"
      collapsible
    />
  </section>
  <section>
    <h3>medium collapsible menu</h3>
    <veui-menu
      :items="items"
      :active.sync="active1"
      :expanded.sync="expanded"
      collapsible
      :collapsed.sync="collapsed"
    />
  </section>
  <section>
    <h3>large menu</h3>
    <veui-menu
      ui="l"
      :items="items2"
      :active.sync="active2"
    />
  </section>
  <section>
    <h3>自定义 icon slot</h3>
    <veui-menu
      ui="s"
      collapsible
      :items="items"
    >
      <veui-icon
        slot="icon"
        name="baidu"
      />
    </veui-menu>
  </section>
  <section><router-view/></section>
</article>
</template>

<script>
import { Menu, Icon } from 'veui'
import { omit } from 'lodash'
import 'veui-theme-one-icons/android'
import 'veui-theme-one-icons/apple-f'
import 'veui-theme-one-icons/baidu'
import 'veui-theme-one-icons/bug'

export default {
  name: 'veui-menu-demo',
  components: {
    'veui-menu': Menu,
    'veui-icon': Icon
  },
  data () {
    let items = [
      {
        label: 'Group One',
        name: 'group-one',
        icon: 'android',
        children: [
          {
            label: 'Sub One',
            name: 'sub-one',
            children: [
              {
                label: 'Input',
                to: '/menu/input'
              }
            ]
          },
          {
            label: 'Loading',
            name: 'Loading',
            to: '/menu/loading',
            children: [
              {
                label: 'Switch',
                to: '/menu/switch'
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
            label: 'Disabled',
            name: 'Disabled',
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
        label: 'Navigation Three',
        name: 'nav-three',
        icon: 'baidu',
        disabled: true
      },
      {
        label: 'Navigation Four',
        name: 'nav-four',
        icon: 'bug',
        children: [
          {
            label: 'Progress',
            to: '/menu/progress'
          }
        ]
      }
    ]
    let items2 = items.map(i => omit(i, 'icon'))
    return {
      expanded: [],
      active1: '一级导航',
      active2: undefined,
      collapsed: undefined,
      items,
      items2
    }
  }
}
</script>

<style lang="less">
.veui-menu-demo {
  .small-menu {
    height: 300px;
  }
}
</style>
