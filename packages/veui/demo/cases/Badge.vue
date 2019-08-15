<template>
<article>
  <h1><code>&lt;veui-badge&gt;</code></h1>
  <section>
    <veui-checkbox v-model="hidden">Hidden</veui-checkbox>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      type="success"
    >保存</veui-badge>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      value="New"
    ><veui-button>消息</veui-button></veui-badge>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      :value="count"
    >
      <veui-button
        ui="primary"
        @click="count++"
      >写文章</veui-button>
    </veui-badge>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      type="aux"
    />
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      type="warning"
      value="审核中"
    />
  </section>
</article>
</template>

<script>
import { Badge, Button, Checkbox } from 'veui'
import 'veui-theme-one-icons/check'
import 'veui-theme-one-icons/edit'
import 'veui-theme-one-icons/search'
import 'veui-theme-one-icons/times'

export default {
  name: 'badge-demo',
  components: {
    'veui-badge': Badge,
    'veui-button': Button,
    'veui-checkbox': Checkbox
  },
  data () {
    return {
      count: 996,
      hidden: false
    }
  }
}
</script>

<style scoped>
section {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}
</style>
