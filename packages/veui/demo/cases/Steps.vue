<template>
<article>
  <h1>
    <code>&lt;veui-steps&gt;</code>
  </h1>
  <section class="settings">
    Step
    <input
      v-model="current"
      type="number"
      step="1"
      min="1"
      :max="steps.length"
    >
    <veui-checkbox v-model="vertical">纵向样式</veui-checkbox>
    <veui-checkbox v-model="stateless">纯展示</veui-checkbox>
  </section>
  <section>
    <h2>默认样式：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      :current="current - 1"
      :ui="`${vertical ? 'vertical' : ''}`"
    />
  </section>
  <section>
    <h2>小型样式：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      :current="current - 1"
      :ui="`s${vertical ? ' vertical' : ''}`"
    />
  </section>
  <section>
    <h2>文案纵向样式：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      ui="label-vertical"
      :current="current - 1"
    />
  </section>
  <section>
    <h2>小型文案纵向样式：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      ui="s label-vertical"
      :current="current - 1"
    />
  </section>
  <section>
    <h2>自定义模板：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      :ui="`${vertical ? ' vertical' : ''}`"
      :current="current - 1"
    >
      <template #label="step">
        {{ step.label }}
        <veui-icon class="star" name="star"/>
      </template>
    </veui-steps>
  </section>
  <section>
    <h2>圆点水平样式：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      ui="dot label-vertical"
      :current="current - 1"
    />
  </section>
  <section>
    <h2>圆点纵向样式：</h2>
    <veui-steps
      :steps="steps"
      :stateless="stateless"
      ui="dot s vertical"
      :current="current - 1"
    />
  </section>
</article>
</template>

<script>
import { Checkbox, Steps, Icon } from 'veui'
import 'veui-theme-dls-icons/star'

export default {
  name: 'steps-demo',
  components: {
    'veui-steps': Steps,
    'veui-checkbox': Checkbox,
    'veui-icon': Icon
  },
  data () {
    return {
      current: 4,
      steps: [
        { label: 'Step 1', desc: '填写信息', to: '/Tabs' },
        { label: 'Step 2', desc: '验证身份' },
        { label: 'Step 3', desc: '填写地址', status: 'error', to: '/Button' },
        { label: 'Step 4', desc: '填写资料', status: 'error' },
        { label: 'Step 5', desc: '', to: '/' }
      ],
      stateless: false,
      vertical: false
    }
  }
}
</script>

<style lang="less" scoped>
input[type="number"] {
  width: 60px;
  height: 30px;
  text-align: center;
  font-size: 14px;
}

.settings {
  display: flex;
  gap: 12px;
  align-items: center;
}

.star {
  vertical-align: text-top;
}
</style>
