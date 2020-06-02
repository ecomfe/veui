<template>
<article class="veui-nav-demo">
  <h1><code>&lt;veui-nav&gt;</code></h1>
  <div>active: {{ active1 }}</div>
  <section>
    <h3>small nav</h3>
    <veui-nav
      :items="items"
      ui="s"
    />
  </section>
  <section>
    <h3>medium nav</h3>
    <veui-nav :items="items"/>
  </section>
  <section>
    <h3>large nav</h3>
    <veui-nav
      :items="items"
      ui="l"
    />
  </section>
  <section>
    <h3>folded nav</h3>
    <veui-nav
      class="rest-nav"
      :items="items"
    />
  </section>
  <section>
    <h3>item-label scoped slot</h3>
    <veui-nav :items="items">
      <template
        slot="item-label"
        slot-scope="item"
      >{{ item.label }}🐂</template>
    </veui-nav>
  </section>
  <section><router-view/></section>
</article>
</template>

<script>
import { Nav } from 'veui'
import { omit } from 'lodash'
import 'veui-theme-dls-icons/clock'
import 'veui-theme-dls-icons/envelope'
import 'veui-theme-dls-icons/eye'
import 'veui-theme-dls-icons/file'

export default {
  name: 'veui-menu-demo',
  components: {
    'veui-nav': Nav
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
                to: '/nav/input'
              }
            ]
          },
          {
            label: 'Loading',
            name: 'Loading',
            to: '/nav/loading'
          }
        ]
      },
      {
        label: 'Button',
        name: 'Button',
        to: '/nav/button',
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
                to: '/nav/link'
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
                to: '/nav/switch'
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
                to: '/nav/number-input',
                children: [
                  {
                    label: 'Schedule',
                    to: '/nav/schedule'
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
            to: '/nav/progress'
          },
          {
            label: 'Radio',
            to: '/nav/radio'
          }
        ]
      }
    ]
    let items2 = items.map(i => omit(i, 'icon'))
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

<style lang="less">
.veui-nav-demo {
  .veui-nav {
    height: 100px;
  }
  .rest-nav {
    width: 500px;
  }
}
</style>
