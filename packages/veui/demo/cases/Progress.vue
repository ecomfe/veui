<template>
<article>
  <h1><code>&lt;veui-progress&gt;</code></h1>
  <section>
    <p>
      Progress <input
        v-model="progress"
        type="number"
        step="0.01"
        min="0"
        :max="1"
      >
    </p>
    <p>
      <veui-button @click="status = 'alert'">
        Trigger Error
      </veui-button>
      <veui-button @click="status = null">
        Clear Status
      </veui-button>
    </p>
  </section>
  <section>
    <h2>线性进度条</h2>
    <veui-progress
      :value="Number(progress)"
      desc
      :auto-succeed="200"
      :status.sync="status"
      :decimal-place="1"
    />
  </section>
  <section>
    <h2>线性进度条（自适应宽度）</h2>
    <veui-progress
      :value="Number(progress)"
      ui="fluid"
      desc
      :auto-succeed="200"
      :status.sync="status"
      :decimal-place="1"
    />
  </section>
  <section>
    <h2>环形进度条</h2>
    <veui-progress
      type="circular"
      :value="Number(progress)"
      desc
      :auto-succeed="200"
      :status.sync="status"
    />
  </section>
  <section>
    <h2>小型环形进度条</h2>
    <veui-progress
      ui="tiny"
      type="circular"
      :value="Number(progress)"
      desc
      :auto-succeed="200"
      :status.sync="status"
    />
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
      status: null
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 30px;
}

.veui-button {
  margin-right: 10px;
}
</style>
