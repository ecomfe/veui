<template>
  <article>
    <h1><code>&lt;veui-radio-button-group&gt;</code></h1>
    <section>
      <veui-checkbox v-model="disabled">禁用</veui-checkbox>
    </section>
    <section>
      <p>
        <veui-radio-button-group :items="data1" name="111" v-model="picked1" :disabled="disabled">
          <template slot-scope="props">{{ props.label }}</template>
        </veui-radio-button-group>
      </p>
      <p>已选：{{ picked1 }}</p>
    </section>
    <section>
      <p>
        <veui-radio-button-group :items="data2" ui="small alt" v-model="picked2" :disabled="disabled">
          <template slot-scope="props">{{ props.label }}</template>
        </veui-radio-button-group>
      </p>
      <p>已选：{{ picked2 }}</p>
    </section>
  </article>
</template>

<script>
import { RadioButtonGroup, Checkbox } from 'veui'

export default {
  name: 'radio-button-group-demo',
  components: {
    'veui-radio-button-group': RadioButtonGroup,
    'veui-checkbox': Checkbox
  },
  data () {
    return {
      picked1: 'euro',
      picked2: 'qq',
      disabled: false,
      data1: [
        {
          value: 'pound', label: '£'
        },
        {
          value: 'euro', label: '€'
        },
        {
          value: 'yen', label: '¥'
        }
      ],
      data2: [
        {
          value: 'bidu', label: '百度'
        },
        {
          value: 'baba', label: '阿里'
        },
        {
          value: 'qq', label: '腾讯'
        }
      ]
    }
  }
}
</script>
