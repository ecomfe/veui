<template>
<article class="demo-embedded">
  <h1><code>&lt;veui-embedded&gt;</code></h1>

  <section>
    <veui-button @click="show = !show">Toggle</veui-button>
  </section>

  <section>
    <veui-embedded :open.sync="show">
      <p>content area</p>
      <template
        slot="title"
        slot-scope="{ close }"
      >
        <a @click="close">
          点我也可关闭
        </a>
      </template>
    </veui-embedded>
  </section>

  <section>
    <veui-embedded
      ui="s"
      :open.sync="show"
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
    </veui-embedded>
  </section>
</article>
</template>

<script>
import { Embedded, Button } from 'veui'

export default {
  name: 'embedded-demo',
  components: {
    'veui-embedded': Embedded,
    'veui-button': Button
  },
  data () {
    return {
      show: true
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
</style>
