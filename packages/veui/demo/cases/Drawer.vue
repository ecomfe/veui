<template>
<article class="demo-drawer">
  <h1>
    <code>&lt;veui-drawer&gt;</code>
  </h1>

  <section>
    <veui-checkbox v-model="modal">Modal</veui-checkbox>
    <veui-checkbox v-model="outsideClosable">outside Closable</veui-checkbox>
  </section>

  <section>
    <veui-button @click="topOpen = true">Top</veui-button>
    <veui-button @click="rightOpen = true">Right</veui-button>
    <veui-button @click="bottomOpen = true">Bottom</veui-button>
    <veui-button @click="leftOpen = true">Left</veui-button>
  </section>

  <veui-drawer
    :open.sync="topOpen"
    class="drawer-demo-instance"
    :outside-closable="outsideClosable"
    overlay-class="drawer-demo-overlay"
    :modal="modal"
    placement="top"
    :before-close="wait"
  >
    <p>content area</p>
    <template #title="{ close }">
      <a @click="close">点我也可关闭</a>
    </template>
    <template #foot="{ close }">
      <veui-button ui="primary" @click="close('foo')">foo</veui-button>
      <veui-button @click="close">cancel</veui-button>
    </template>
  </veui-drawer>
  <veui-drawer
    :open.sync="rightOpen"
    :modal="modal"
    :outside-closable="outsideClosable"
    placement="right"
    title="Hey man"
  >
    <veui-button @click="right2Open = true">Second</veui-button>
    <veui-drawer
      title="Hey second"
      :modal="modal"
      :open.sync="right2Open"
      :outside-closable="outsideClosable"
      placement="right"
    >
      <veui-button @click="right3Open = true">Third</veui-button>
      <veui-drawer
        title="Hey third"
        :modal="modal"
        :open.sync="right3Open"
        :outside-closable="outsideClosable"
        placement="right"
      />
    </veui-drawer>
  </veui-drawer>
  <veui-drawer
    title="Hey man"
    :modal="modal"
    :open.sync="bottomOpen"
    :outside-closable="outsideClosable"
    placement="bottom"
  >
    <veui-button @click="left2Open = true">Left</veui-button>
    <veui-drawer
      title="Hey left"
      :modal="modal"
      :open.sync="left2Open"
      :outside-closable="outsideClosable"
      placement="left"
    >
      <veui-button @click="top2Open = true">Top</veui-button>
      <veui-drawer
        title="Hey third"
        :modal="modal"
        :open.sync="top2Open"
        :outside-closable="outsideClosable"
        placement="top"
      >
        <veui-button @click="bottom2Open = true">Bottom</veui-button>
        <veui-drawer
          title="Hey bottom"
          :modal="modal"
          :open.sync="bottom2Open"
          :outside-closable="outsideClosable"
          placement="bottom"
        >
          <veui-button @click="left3Open = true">Left</veui-button>
          <veui-drawer
            title="Hey left"
            :modal="modal"
            :open.sync="left3Open"
            :outside-closable="outsideClosable"
            placement="left"
          />
        </veui-drawer>
      </veui-drawer>
    </veui-drawer>
  </veui-drawer>
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
      top2Open: false,
      rightOpen: false,
      right2Open: false,
      right3Open: false,
      bottomOpen: false,
      bottom2Open: false,
      leftOpen: false,
      left2Open: false,
      left3Open: false
    }
  },
  methods: {
    wait () {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 1000)
      })
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
