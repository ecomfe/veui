<template>
<article class="veui-sidenav-demo">
  <h1>
    <code>&lt;veui-sidenav&gt;</code>
  </h1>
  <div>expanded: {{ expanded }}</div>
  <div>active: {{ active1 }}</div>
  <veui-button
    @click="$router.push('/sidenav/input')"
  >跳转到 input</veui-button>
  <veui-button @click="collapsed = !collapsed">切换展开</veui-button>
  <section>
    <h3>small collapsible sidenav</h3>
    <veui-sidenav
      class="small-sidenav"
      ui="s"
      :items="items"
      :expanded.sync="expanded"
      :collapsed.sync="collapsed"
    />
  </section>
  <section>
    <h3>medium collapsible sidenav</h3>
    <veui-sidenav
      :items="items"
      :active.sync="active1"
      :expanded.sync="expanded"
      :collapsed.sync="collapsed"
    />
  </section>
  <section>
    <h3>large sidenav</h3>
    <veui-sidenav
      ui="l"
      :items="items2"
      :active.sync="active2"
      :collapsed.sync="collapsed"
    />
  </section>
  <section>
    <h3>自定义 icon slot</h3>
    <veui-sidenav ui="s" :collapsed.sync="collapsed" :items="items">
      <veui-icon slot="icon" name="baidu"/>
    </veui-sidenav>
  </section>
  <section>
    <router-view/>
  </section>
</article>
</template>

<script>
import { Sidenav, Button, Icon } from 'veui'
import { omit } from 'lodash'
import 'veui-theme-dls-icons/clock'
import 'veui-theme-dls-icons/envelope'
import 'veui-theme-dls-icons/eye'
import 'veui-theme-dls-icons/file'

export default {
  name: 'veui-sidenav-demo',
  components: {
    'veui-sidenav': Sidenav,
    'veui-icon': Icon,
    'veui-button': Button
  },
  data () {
    let items = [
      {
        label: 'Group One',
        name: 'group-one',
        icon: 'clock',
        position: 'card',
        children: [
          {
            label: 'Sub One',
            name: 'sub-one',
            icon: 'envelope',
            children: [
              {
                label: 'Input',
                to: '/sidenav/input'
              }
            ]
          },
          {
            label: 'Loading',
            name: 'Loading',
            to: '/sidenav/loading'
          }
        ]
      },
      {
        label: 'Button',
        name: 'Button',
        to: '/sidenav/button',
        icon: 'eye',
        children: [
          {
            label: 'Disabled',
            name: 'Disabled',
            disabled: true,
            children: [
              {
                label: 'Link',
                name: 'Link',
                to: '/sidenav/link'
              }
            ]
          }
        ]
      },
      {
        label: 'Navigation Three',
        name: 'nav-three',
        icon: 'file',
        disabled: true
      },
      {
        label: 'Navigation Four',
        name: 'nav-four',
        icon: 'file',
        children: [
          {
            label: 'Four Sub One',
            name: 'four-sub-one',
            children: [
              {
                label: 'Switch',
                to: '/sidenav/switch'
              }
            ]
          },
          {
            label: 'Number Input Sub',
            name: 'number-input-sub',
            children: [
              {
                label: 'NumberInput',
                name: 'menu-number-input',
                to: '/sidenav/number-input',
                children: [
                  {
                    label: 'Schedule',
                    to: '/sidenav/schedule'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        label: 'Navigation Five',
        name: 'nav-five',
        icon: 'file',
        children: [
          {
            label: 'Progress',
            to: '/sidenav/progress'
          },
          {
            label: 'Radio',
            to: '/sidenav/radio'
          }
        ]
      }
    ]
    let items2 = items.map((i) => omit(i, 'icon'))
    return {
      expanded: [],
      active1: null,
      active2: undefined,
      collapsed: undefined,
      items,
      items2
    }
  }
}
</script>

<style lang="less" scoped>
.veui-sidenav-demo {
  .small-sidenav {
    height: 300px;
  }

  .veui-button + .veui-button {
    margin-left: 8px;
  }
}
</style>
