<template>
  <article>
    <h1><code>&lt;veui-steps&gt;</code></h1>
    <section>
      Step <input type="number" step="1" min="1" :max="steps.length" v-model="current">
    </section>
    <section>
      <h2>默认样式：</h2>
      <veui-steps :steps="steps" :current="current - 1"></veui-steps>
    </section>
    <section>
      <h2>多行样式：</h2>
      <veui-steps :steps="steps" ui="full" :current="current - 1"></veui-steps>
    </section>
  </article>
</template>

<script>
import { Steps } from 'veui'

export default {
  name: 'steps-demo',
  components: {
    'veui-steps': Steps
  },
  data () {
    return {
      current: 1,
      steps: [
        { label: 'Step 1', desc: '填写信息' },
        { label: 'Step 2', desc: '验证身份' },
        { label: 'Step 3', desc: '注册成功' }
      ]
    }
  }
}
</script>
