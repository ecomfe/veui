<template>
<article class="demo-drawer">
  <h1><code>&lt;veui-drawer&gt;</code></h1>

  <section>
    <veui-checkbox v-model="modal">Modal</veui-checkbox>
    <veui-checkbox v-model="outsideClosable">outside Closable</veui-checkbox>
  </section>

  <section>
    <veui-button @click="topOpen = true">
      Top
    </veui-button>
    <veui-button @click="rightOpen = true">
      Right
    </veui-button>
    <veui-button @click="bottomOpen = true">
      Bottom
    </veui-button>
    <veui-button @click="leftOpen = true">
      Left
    </veui-button>
  </section>

  <veui-drawer
    :open.sync="topOpen"
    class="drawer-demo-instance"
    :outside-closable="outsideClosable"
    :modal="modal"
    placement="top"
  >
    <p>content area</p>
    <template
      slot="title"
      slot-scope="{ close }"
    >
      <a @click="close">
        点我也可关闭
      </a>
    </template>
    <template slot="foot">
      <div>我是foot</div>
    </template>
  </veui-drawer>
  <veui-drawer
    :open.sync="rightOpen"
    :modal="modal"
    :outside-closable="outsideClosable"
    placement="right"
    title="Hey man"
  />
  <veui-drawer
    title="Hey man"
    :modal="modal"
    :open.sync="bottomOpen"
    :outside-closable="outsideClosable"
    placement="bottom"
  />
  <veui-drawer
    title="Hey man"
    :modal="modal"
    :open.sync="leftOpen"
    overlay-class="customed-class"
    :outside-closable="outsideClosable"
    placement="left"
  />
</article>
</template>

<script>
import { Checkbox, Drawer, Button } from 'veui'

export default {
  name: 'drawer-demo',
  components: {
    'veui-drawer': Drawer,
    'veui-checkbox': Checkbox,
    'veui-button': Button
  },
  data () {
    return {
      modal: true,
      outsideClosable: true,
      topOpen: false,
      rightOpen: false,
      bottomOpen: false,
      leftOpen: false
    }
  }
}
</script>

<style lang="less" scoped>
section {
  & + & {
    margin-top: 20px;
  }
}

.veui-button,
.veui-checkbox {
  & + & {
    margin-left: 20px;
  }
}
</style>
