<template>
<article>
  <h1><code>&lt;veui-switch&gt;</code></h1>
  <section>
    <veui-switch v-model="loading">
      加载中
    </veui-switch>
  </section>
  <section>
    <veui-switch
      v-model="value1"
      ui="xs"
      :loading="loading"
    >
      夜间模式
    </veui-switch>
    <veui-switch
      v-model="value1"
      ui="xs"
      readonly
    />
    <veui-switch
      v-model="value1"
      ui="xs"
      disabled
    />
  </section>
  <section>
    <veui-switch
      v-model="value3"
      ui="s"
      :loading="loading"
    >
      飞行模式
    </veui-switch>
    <veui-switch
      v-model="value3"
      ui="s"
      readonly
    />
    <veui-switch
      v-model="value3"
      ui="s"
      disabled
    />
  </section>
  <section>
    <veui-switch
      v-model="value2"
      :loading="loading"
    >
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
      :checked="asyncValue"
      :loading="asyncLoading"
      @click.prevent="toggle"
    >异步</veui-switch>
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
      value3: true,
      loading: false,
      asyncValue: false,
      asyncLoading: false
    }
  },
  methods: {
    toggle () {
      this.asyncLoading = true
      setTimeout(() => {
        this.asyncValue = !this.asyncValue
        this.asyncLoading = false
      }, 2000)
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
