<template>
<article>
  <h1><code>&lt;veui-progress&gt;</code></h1>
  <section>
    <p>
      Progress
      <input
        v-model="progress"
        type="number"
        step="0.01"
        min="0"
        :max="1"
      >
    </p>
    <p>
      <veui-button @click="status = 'error'">
        Trigger Error
      </veui-button>
      <veui-button @click="status = null">
        Clear Status
      </veui-button>
      <veui-button
        @click="indeterminate = !indeterminate"
      >Toggle Indeterminate</veui-button>
    </p>
  </section>
  <section>
    <h2>线性进度条</h2>
    <veui-progress
      :value="Number(progress)"
      desc
      :autosucceed="200"
      :status.sync="status"
      :decimal-place="1"
      :indeterminate="indeterminate"
    />
  </section>
  <section>
    <h2>线性进度条（不确定进度）</h2>
    <veui-progress
      :status.sync="status"
      indeterminate
    />
  </section>
  <section>
    <h2>线性进度条（小尺寸）</h2>
    <veui-progress
      :value="Number(progress)"
      ui="s"
      desc
      :autosucceed="200"
      :status.sync="status"
      :decimal-place="1"
      :indeterminate="indeterminate"
    />
  </section>
  <section>
    <h2>线性进度条（自适应）</h2>
    <veui-progress
      :value="Number(progress)"
      ui="fluid"
      desc
      :autosucceed="200"
      :status.sync="status"
      :decimal-place="1"
      :indeterminate="indeterminate"
    />
  </section>
  <section>
    <h2>环形进度条</h2>
    <veui-progress
      type="circular"
      :value="Number(progress)"
      desc
      :autosucceed="200"
      :status.sync="status"
    />
  </section>
  <section>
    <h2>环形进度条（小尺寸）</h2>
    <veui-progress
      ui="s"
      type="circular"
      :value="Number(progress)"
      desc
      :autosucceed="200"
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
      status: null,
      indeterminate: false
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
