<template>
<article>
  <h1><code>&lt;veui-switch&gt;</code></h1>
  <section>
    <veui-switch
      v-model="value1"
      ui="small"
    >
      夜间模式
    </veui-switch>
    <veui-switch
      v-model="value1"
      ui="small"
      readonly
    />
    <veui-switch
      v-model="value1"
      ui="small"
      disabled
    />
  </section>
  <section>
    <veui-switch v-model="value2">
      勿扰模式
    </veui-switch>
    <veui-switch
      v-model="value2"
      readonly
    />
    <veui-switch
      v-model="value2"
      disabled
    />
  </section>
  <section>
    <veui-switch
      v-model="value3"
      ui="large"
    >
      飞行模式
    </veui-switch>
    <veui-switch
      v-model="value3"
      ui="large"
      readonly
    />
    <veui-switch
      v-model="value3"
      ui="large"
      disabled
    />
  </section>
</article>
</template>

<script>
import { Switch } from 'veui'

export default {
  name: 'switch-demo',
  components: {
    'veui-switch': Switch
  },
  data () {
    return {
      value1: true,
      value2: false,
      value3: true
    }
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
