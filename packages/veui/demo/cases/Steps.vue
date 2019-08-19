<template>
<article>
  <h1><code>&lt;veui-steps&gt;</code></h1>
  <section>
    <p>
      Step
      <input
        v-model="current"
        type="number"
        step="1"
        min="1"
        :max="steps.length"
      >
    </p>
    <p>
      <label>
        <veui-checkbox v-model="vertical">
          纵向样式
        </veui-checkbox>
      </label>
    </p>
  </section>
  <section>
    <h2>默认样式：</h2>
    <veui-steps
      :steps="steps"
      :current="current - 1"
      :ui="`${vertical ? 'vertical' : ''}`"
    />
  </section>
  <section>
    <h2>小型样式：</h2>
    <veui-steps
      :steps="steps"
      :current="current - 1"
      :ui="`s${vertical ? ' vertical' : ''}`"
    />
  </section>
  <section>
    <h2>文案纵向样式：</h2>
    <veui-steps
      :steps="steps"
      :ui="`labelVertical ${vertical ? ' vertical' : ''}`"
      :current="current - 1"
      label-place="vertical"
    />
  </section>
  <section>
    <h2>小型文案纵向样式：</h2>
    <veui-steps
      :steps="steps"
      :ui="`s labelVertical ${vertical ? ' vertical' : ''}`"
      :current="current - 1"
      label-place="vertical"
    />
  </section>
  <section>
    <h2>自定义模板：</h2>
    <veui-steps
      :steps="steps"
      :ui="`${vertical ? ' vertical' : ''}`"
      :current="current - 1"
    >
      <template
        slot="label"
        slot-scope="step"
      >
        {{ step.label }} <veui-icon
          class="star"
          name="star"
        />
      </template>
    </veui-steps>
  </section>
</article>
</template>

<script>
import { Checkbox, Steps, Icon } from 'veui'
import 'vue-awesome/icons/star'

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
        { label: 'Step 3', desc: '填写地址', status: 'error' },
        { label: 'Step 4', desc: '填写资料', status: 'error' },
        { label: 'Step 5', desc: '' }
      ],
      vertical: false
    }
  }
}
</script>

<style lang="less" scoped>
input[type='number'] {
  width: 60px;
  height: 30px;
  text-align: center;
  font-size: 14px;
}
.star {
  vertical-align: text-top;
}
</style>
