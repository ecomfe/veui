<template>
  <article>
    <h1><code>&lt;veui-radiobox&gt;</code></h1>
    <p>
      <veui-radiobox name="a" value="normal" v-model="a1">正常状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox name="a" value="small" ui="small" v-model="a2">正常状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox checked>选中状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox ui="small" checked>选中状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox checked disabled>选中无效状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox ui="small" checked disabled>选中无效状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox disabled>未选无效状态</veui-radiobox>
    </p>
    <p>
      <veui-radiobox ui="small" disabled>未选无效状态</veui-radiobox>
    </p>
  </article>
</template>

<script>
import Radiobox from '@/components/Radiobox'

export default {
  name: 'Radiobox',
  components: {
    'veui-radiobox': Radiobox
  },
  data () {
    return {
      a1: false,
      a2: false
    }
  }
}
</script>
