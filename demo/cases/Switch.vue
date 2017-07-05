<template>
  <article>
    <h1><code>&lt;veui-switch&gt;</code></h1>
    <section>
      <veui-switch ui="small" v-model="value1"></veui-switch>
      <veui-switch ui="small" v-model="value1" readonly></veui-switch>
      <veui-switch ui="small" v-model="value1" disabled></veui-switch>
    </section>
    <section>
      <veui-switch v-model="value2"></veui-switch>
      <veui-switch v-model="value2" readonly></veui-switch>
      <veui-switch v-model="value2" disabled></veui-switch>
    </section>
    <section>
      <veui-switch ui="large" v-model="value3"></veui-switch>
      <veui-switch ui="large" v-model="value3" readonly></veui-switch>
      <veui-switch ui="large" v-model="value3" disabled></veui-switch>
    </section>
  </article>
</template>

<script>
import Switch from '@/components/Switch'

export default {
  name: 'Switch',
  components: {
    'veui-switch': Switch
  },
  data () {
    return {
      value1: true,
      value2: false,
      value3: true
    }
  },
  destroyed () {
  }
}
</script>

<style scoped>
section {
  margin-bottom: 10px;
}

.veui-switch {
  margin-right: 10px;
}
</style>
