<template>
  <article>
    <h1><code>&lt;veui-radioboxgroup&gt;</code></h1>
    <p>
      <veui-radioboxgroup :items="data1" name="111" v-model="picked1">
        <template scope="props">{{ props.label }}</template>
      </veui-radioboxgroup>
    </p>
    <p>value: {{ picked1 }}</p>
    <p>
      <veui-radioboxgroup :items="data2" ui="small" v-model="picked2">
        <template scope="props">{{ props.label }}</template>
      </veui-radioboxgroup>
    </p>
    <p>value: {{ picked2 }}</p>
  </article>
</template>

<script>
import { RadioboxGroup } from 'veui'

export default {
  name: 'radioboxgroup-demo',
  components: {
    'veui-radioboxgroup': RadioboxGroup
  },
  data () {
    return {
      picked1: 'Akiyama Mio',
      picked2: 'Nakano Azusa',
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
