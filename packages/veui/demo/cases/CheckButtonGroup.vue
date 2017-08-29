<template>
  <article>
    <h1><code>&lt;veui-check-button-group&gt;</code></h1>
    <p>
      <veui-check-button-group :items="data1" v-model="picked1">
        <template scope="props">{{ props.label }}</template>
      </veui-check-button-group>
    </p>
    <p>value: {{ picked1 }}</p>
    <p>
      <veui-check-button-group :items="data2" ui="small" v-model="picked2">
        <template scope="props">{{ props.label }}</template>
      </veui-check-button-group>
    </p>
    <p>value: {{ picked2 }}</p>
  </article>
</template>

<script>
import { CheckButtonGroup } from 'veui'

export default {
  name: 'check-button-group-demo',
  components: {
    'veui-check-button-group': CheckButtonGroup
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
