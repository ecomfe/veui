<template>
  <article>
    <h1><code>&lt;veui-progress&gt;</code></h1>
    <section>
      <p>
        Progress <input type="number" step="0.01" min="0" :max="1" v-model="progress">
      </p>
      <p>
        <veui-button @click="state = 'alert'">Trigger Error</veui-button>
        <veui-button @click="state = null">Clear Error</veui-button>
      </p>
    </section>
    <section>
      <h2>线性进度条</h2>
      <veui-progress :value="Number(progress)" desc :auto-succeed="200" :state.sync="state" :precision="1"></veui-progress>
    </section>
    <section>
      <h2>环形进度条</h2>
      <veui-progress type="circular" :value="Number(progress)" desc :auto-succeed="200" :state.sync="state"></veui-progress>
    </section>
    <section>
      <h2>小型环形进度条</h2>
      <veui-progress ui="tiny" type="circular" :value="Number(progress)" desc :auto-succeed="200" :state.sync="state"></veui-progress>
    </section>
  </article>
</template>

<script>
import { Button, Progress } from 'veui'

export default {
  name: 'progress-demo',
  components: {
    'veui-button': Button,
    'veui-progress': Progress
  },
  data () {
    return {
      progress: 0.3,
      state: null
    }
  }
}
</script>

<style lang="less">
section {
  margin-bottom: 30px;
}

.veui-button {
  margin-right: 10px;
}
</style>
