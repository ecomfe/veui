<template>
<article class="demo-drawer">
  <h1><code>&lt;veui-drawer&gt;</code></h1>
  <veui-button @click="topOpen = true">
    打开 top Drawer
  </veui-button>
  <veui-button
    ui="primary"
    @click="rightOpen = true"
  >
    打开 right Drawer
  </veui-button>
  <veui-button @click="bottomOpen = true">
    打开 bottom Drawer
  </veui-button>
  <veui-button
    ui="primary"
    @click="leftOpen = true"
  >
    打开 left Drawer
  </veui-button>
  <veui-drawer
    :open.sync="topOpen"
    class="drawer-demo-instance"
    placement="top"
  >
    <p>content area</p>
    <template
      slot="title"
      slot-scope="{ close }"
    >
      <div @click="close">
        点我也可关闭
      </div>
    </template>
    <template
      slot="foot"
    >
      <div>我是foot</div>
    </template>
  </veui-drawer>
  <veui-drawer
    :open.sync="rightOpen"
    placement="right"
    title="Hey man"
  />
  <veui-drawer
    title="Hey man"
    :open.sync="bottomOpen"
    placement="bottom"
  />
  <veui-drawer
    title="Hey man"
    :open.sync="leftOpen"
    placement="left"
  />
</article>
</template>

<script>
import { Drawer, Button } from 'veui'

export default {
  name: 'drawer-demo',
  components: {
    'veui-drawer': Drawer,
    'veui-button': Button
  },
  data () {
    return {
      topOpen: false,
      rightOpen: false,
      bottomOpen: false,
      leftOpen: false
    }
  }
}
</script>
