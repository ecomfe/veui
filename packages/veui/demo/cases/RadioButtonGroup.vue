<template>
  <article>
    <h1><code>&lt;veui-radio-button-group&gt;</code></h1>
    <section>
      <p>
        <veui-radio-button-group ui="primary" :items="data1" name="111" v-model="picked1">
          <template scope="props">{{ props.label }}</template>
        </veui-radio-button-group>
      </p>
      <p>已选：{{ picked1 }}</p>
    </section>
    <section>
      <p>
        <veui-radio-button-group :items="data2" ui="small" v-model="picked2">
          <template scope="props">{{ props.label }}</template>
        </veui-radio-button-group>
      </p>
      <p>已选：{{ picked2 }}</p>
    </section>
  </article>
</template>

<script>
import { RadioButtonGroup } from 'veui'

export default {
  name: 'radio-button-group-demo',
  components: {
    'veui-radio-button-group': RadioButtonGroup
  },
  data () {
    return {
      picked1: 'euro',
      picked2: 'qq',
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
