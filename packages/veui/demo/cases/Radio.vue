<template>
  <article>
    <h1><code>&lt;veui-radio&gt;</code></h1>
    <p>
      <veui-radio name="a" value="normal" v-model="a1">正常状态</veui-radio>
    </p>
    <p>
      <veui-radio name="a" value="small" ui="small" v-model="a2">正常状态</veui-radio>
    </p>
    <p>
      <veui-radio checked>选中状态</veui-radio>
    </p>
    <p>
      <veui-radio ui="small" checked>选中状态</veui-radio>
    </p>
    <p>
      <veui-radio checked disabled>选中无效状态</veui-radio>
    </p>
    <p>
      <veui-radio ui="small" checked disabled>选中无效状态</veui-radio>
    </p>
    <p>
      <veui-radio disabled>未选无效状态</veui-radio>
    </p>
    <p>
      <veui-radio ui="small" disabled>未选无效状态</veui-radio>
    </p>
  </article>
</template>

<script>
import { Radio } from 'veui'

export default {
  name: 'radio-demo',
  components: {
    'veui-radio': Radio
  },
  data () {
    return {
      a1: false,
      a2: false
    }
  }
}
</script>
