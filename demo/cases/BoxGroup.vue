<template>
  <article>
    <h1><code>&lt;veui-boxgroup&gt;</code></h1>
    <p>
      <veui-boxgroup :items="data1" type="radiobox" name="111" v-model="picked1">
        <template scope="props">{{ props.label }}</template>
      </veui-boxgroup>
    </p>
    <p>value: {{ picked1 }}</p>
    <p>
      <veui-boxgroup :items="data2" type="radiobox" name="222" ui="small" v-model="picked2">
        <template scope="props">{{ props.label }}</template>
      </veui-boxgroup>
    </p>
    <p>value: {{ picked2 }}</p>
    <p>
      <veui-boxgroup :items="data3" type="checkbox" name="333" v-model="picked3">
        <template scope="props">{{ props.label }}</template>
      </veui-boxgroup>
    </p>
    <p>value: {{ picked3 }}</p>
    <p>
      <veui-boxgroup :items="data4" type="checkbox" name="444" ui="small" v-model="picked4">
        <template scope="props">{{ props.label }}</template>
      </veui-boxgroup>
    </p>
    <p>value: {{ picked4 }}</p>
  </article>
</template>

<script>
import BoxGroup from '@/components/BoxGroup'

export default {
  name: 'boxGroup',
  components: {
    'veui-boxgroup': BoxGroup
  },
  data () {
    return {
      picked1: 'Akiyama Mio',
      picked2: 'Nakano Azusa',
      picked3: ['Hirasawa Yui', 'Akiyama Mio'],
      picked4: [],
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
      ],
      data3: [
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
      data4: [
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
