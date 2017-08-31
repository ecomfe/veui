<template>
  <article>
    <h1><code>&lt;veui-checkbox-group&gt;</code></h1>
    <p>
      <veui-checkbox-group :items="data1" v-model="picked1">
        <template scope="props">{{ props.label }}</template>
      </veui-checkbox-group>
    </p>
    <p>value: {{ picked1 }}</p>
    <p>
      <veui-checkbox-group :items="data2" ui="small" v-model="picked2">
        <template scope="props">{{ props.label }}</template>
      </veui-checkbox-group>
    </p>
    <p>value: {{ picked2 }}</p>
  </article>
</template>

<script>
import { CheckboxGroup } from 'veui'

export default {
  name: 'checkbox-group-demo',
  components: {
    'veui-checkbox-group': CheckboxGroup
  },
  data () {
    return {
      picked1: ['Hirasawa Yui', 'Akiyama Mio'],
      picked2: [],
      data1: [
        {
          value: 'Hirasawa Yui', label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio', label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa', label: 'Nakano Azusa'
        }
      ],
      data2: [
        {
          value: 'Hirasawa Yui', label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio', label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa', label: 'Nakano Azusa'
        }
      ]
    }
  }
}
</script>
