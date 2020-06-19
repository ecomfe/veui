<template>
<article class="veui-nav-demo">
  <h1><code>&lt;veui-nav&gt;</code></h1>
  <div>active: {{ active }}</div>
  <section>
    <h3>small nav</h3>
    <veui-nav
      :items="items"
      :active.sync="active"
      ui="s"
    />
  </section>
  <section>
    <h3>medium nav</h3>
    <veui-nav
      :items="items"
      :active.sync="active"
    />
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
    <h3>uncontrolled nav</h3>
    <veui-nav :items="items"/>
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
  <section>
    <h3>named nav（without to）</h3>
    <veui-nav :items="nameItems"/>
  </section>
  <section>
    <h3>nav based on params</h3>
    <veui-nav :items="nameItems"/>
  </section>
  <section><router-view/></section>
</article>
</template>

<script>
import { Nav } from 'veui'
import 'veui-theme-dls-icons/clock'
import 'veui-theme-dls-icons/envelope'
import 'veui-theme-dls-icons/eye'
import 'veui-theme-dls-icons/file'

export default {
  name: 'veui-nav-demo',
  components: {
    'veui-nav': Nav
  },
  data () {
    let items = [
      {
        label: 'Navigation One',
        name: 'navigation-one',
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
            to: '/nav/loading',
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
    let nameItems = [
      {
        label: 'Group One',
        name: 'group-one',
        position: 'card',
        children: [
          {
            label: 'Sub One',
            name: 'sub-one',
            children: [
              {
                label: 'Input',
                name: 'Input'
              }
            ]
          }
        ]
      },
      {
        label: 'Button',
        name: 'Button',
        children: [
          {
            label: 'OptionGroup',
            name: 'OptionGroup',
            children: [
              {
                label: 'Link',
                name: 'Link'
              }
            ]
          }
        ]
      },
      {
        label: 'Loading',
        name: 'Loading'
      }
    ]
    return {
      active: null,
      items,
      nameItems
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
