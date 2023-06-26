<template>
<article>
  <h1>
    <code>&lt;veui-badge&gt;</code>
  </h1>
  <section>
    <veui-checkbox v-model="hidden">Hidden</veui-checkbox>
    <veui-checkbox v-model="toggle">Toggle</veui-checkbox>
  </section>
  <section>
    <veui-badge
      :hidden="hidden"
      status="success"
    ><span v-if="toggle">保存</span></veui-badge>
    <veui-badge :hidden="hidden" status="info">保存</veui-badge>
    <veui-badge :hidden="hidden">保存</veui-badge>
    <veui-badge :hidden="hidden" status="warning">保存</veui-badge>
    <veui-badge :hidden="hidden" status="aux">保存</veui-badge>
  </section>
  <section>
    <veui-badge :hidden="hidden" value="New" status="success">
      <veui-button>消息</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" value="New" status="info">
      <veui-button>消息</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" value="New">
      <veui-button>消息</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" value="New" status="warning">
      <veui-button>消息</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" value="New" status="aux">
      <veui-button>消息</veui-button>
    </veui-badge>
  </section>
  <section>
    <veui-badge :hidden="hidden" :value="count" status="success">
      <veui-button ui="primary" @click="count++">写文章</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" :value="count" status="info">
      <veui-button ui="primary" @click="count++">写文章</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" :value="count">
      <veui-button ui="primary" @click="count++">写文章</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" :value="count" status="warning">
      <veui-button ui="primary" @click="count++">写文章</veui-button>
    </veui-badge>
    <veui-badge :hidden="hidden" :value="count" status="aux">
      <veui-button ui="primary" @click="count++">写文章</veui-button>
    </veui-badge>
  </section>
  <section>
    <veui-badge :hidden="hidden" status="success"/>
    <veui-badge :hidden="hidden" status="info"/>
    <veui-badge :hidden="hidden"/>
    <veui-badge :hidden="hidden" status="error"/>
    <veui-badge :hidden="hidden" status="warning"/>
    <veui-badge :hidden="hidden" status="aux"/>
  </section>
  <section>
    <veui-badge :hidden="hidden" status="success" value="审核中"/>
    <veui-badge :hidden="hidden" status="info" value="审核中"/>
    <veui-badge :hidden="hidden" value="审核中"/>
    <veui-badge :hidden="hidden" status="warning" value="审核中"/>
    <veui-badge :hidden="hidden" status="aux" value="审核中"/>
  </section>
</article>
</template>

<script>
import { Badge, Button, Checkbox } from 'veui'
import 'veui-theme-dls-icons/check'
import 'veui-theme-dls-icons/edit'
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
      hidden: false,
      toggle: false
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
