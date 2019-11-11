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
    <veui-badge
      :hidden="hidden"
      type="info"
    >保存</veui-badge>
    <veui-badge :hidden="hidden">保存</veui-badge>
    <veui-badge
      :hidden="hidden"
      type="warning"
    >保存</veui-badge>
    <veui-badge
      :hidden="hidden"
      type="aux"
    >保存</veui-badge>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      value="New"
      type="success"
    ><veui-button>消息</veui-button></veui-badge>
    <veui-badge
      :hidden="hidden"
      value="New"
      type="info"
    ><veui-button>消息</veui-button></veui-badge>
    <veui-badge
      :hidden="hidden"
      value="New"
    ><veui-button>消息</veui-button></veui-badge>
    <veui-badge
      :hidden="hidden"
      value="New"
      type="warning"
    ><veui-button>消息</veui-button></veui-badge>
    <veui-badge
      :hidden="hidden"
      value="New"
      type="aux"
    ><veui-button>消息</veui-button></veui-badge>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      :value="count"
      type="success"
    >
      <veui-button
        ui="primary"
        @click="count++"
      >写文章</veui-button>
    </veui-badge>
    <veui-badge
      :hidden="hidden"
      :value="count"
      type="info"
    >
      <veui-button
        ui="primary"
        @click="count++"
      >写文章</veui-button>
    </veui-badge>
    <veui-badge
      :hidden="hidden"
      :value="count"
    >
      <veui-button
        ui="primary"
        @click="count++"
      >写文章</veui-button>
    </veui-badge>
    <veui-badge
      :hidden="hidden"
      :value="count"
      type="warning"
    >
      <veui-button
        ui="primary"
        @click="count++"
      >写文章</veui-button>
    </veui-badge>
    <veui-badge
      :hidden="hidden"
      :value="count"
      type="aux"
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
      type="success"
    />
    <veui-badge
      :hidden="hidden"
      type="info"
    />
    <veui-badge :hidden="hidden"/>
    <veui-badge
      :hidden="hidden"
      type="error"
    />
    <veui-badge
      :hidden="hidden"
      type="warning"
    />
    <veui-badge
      :hidden="hidden"
      type="aux"
    />
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      type="success"
      value="审核中"
    />
    <veui-badge
      :hidden="hidden"
      type="info"
      value="审核中"
    />
    <veui-badge
      :hidden="hidden"
      value="审核中"
    />
    <veui-badge
      :hidden="hidden"
      type="warning"
      value="审核中"
    />
    <veui-badge
      :hidden="hidden"
      type="aux"
      value="审核中"
    />
  </section>
</article>
</template>

<script>
import { Badge, Button, Checkbox } from 'veui'
import 'veui-theme-dls-icons/check'
import 'veui-theme-one-icons/edit'
import 'veui-theme-dls-icons/search'
import 'veui-theme-dls-icons/times'

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

.veui-badge {
  margin-right: 28px;
}
</style>
