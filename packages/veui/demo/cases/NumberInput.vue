<template>
  <article>
    <h1><code>&lt;veui-number-input&gt;</code></h1>
    <section>
      <veui-form>
        <veui-field label="Micro：" ui="micro">
          <veui-number-input ui="micro" v-model="number">
            <template slot="before">Value:</template>
          </veui-number-input>
        </veui-field>
        <veui-field label="Tiny：" ui="tiny" tip="精确到小数点后 1 位">
          <veui-number-input ui="tiny" v-model="number1" :decimal-place="1"/>
        </veui-field>
        <veui-field label="Small：" ui="small" tip="精确到小数点后 2 位">
          <veui-number-input ui="small" v-model="number2" :decimal-place="2"/>
        </veui-field>
        <veui-field label="Normal：" tip="基准值每次加 0.1">
          <veui-number-input v-model="number3" :step="0.1" :decimal-place="1"/>
        </veui-field>
        <veui-field label="Large：" ui="large" tip="基准值每次加 10">
          <veui-number-input ui="large" v-model="number4" :step="10"/>
        </veui-field>
        <veui-field label="DecimalPlace = -1：" tip="不处理精度问题">
          <veui-number-input v-model="number5" :decimal-place="-1"/>
        </veui-field>
        <veui-field label="Max &amp;&amp; Min：" :rules="[{name: 'min', value: -1}]" tip="最大值不大于 10，最小值不小于 -1">
          <veui-number-input v-model="number6" :max="10"/>
        </veui-field>
        <veui-field label="Readonly：">
          <veui-number-input readonly v-model="number7"/>
        </veui-field>
        <veui-field label="Disabled：" disabled>
          <veui-number-input v-model="number7"/>
        </veui-field>
      </veui-form>
    </section>
  </article>
</template>

<script>
import { NumberInput, Field, Form } from 'veui'

export default {
  name: 'number-input',
  components: {
    'veui-number-input': NumberInput,
    'veui-field': Field,
    'veui-form': Form
  },
  data () {
    return {
      number: null,
      number1: null,
      number2: null,
      number3: null,
      number4: null,
      number5: null,
      number6: null,
      number7: 1024
    }
  }
}
</script>

<style lang="less" scoped>
.veui-form {
  & /deep/ .veui-form-label {
    width: 130px;
    color: #999;
  }
}
</style>
