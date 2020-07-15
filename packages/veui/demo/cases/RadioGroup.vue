<template>
<article>
  <h1><code>&lt;veui-radio-group&gt;</code></h1>
  <p>
    <veui-radio-group
      v-model="picked1"
      :items="data1"
      name="111"
    >
      <template #item="props">
        {{ props.label }}
      </template>
    </veui-radio-group>
  </p>
  <p>value: {{ picked1 }}</p>
  <p>
    <veui-radio-group
      v-model="picked2"
      :items="data2"
      ui="s"
    >
      <template
        slot="item"
        slot-scope="props"
      >
        {{ props.label }}
      </template>
    </veui-radio-group>
  </p>
  <p>value: {{ picked2 }}</p>
</article>
</template>

<script>
import { RadioGroup } from 'veui'

export default {
  name: 'radio-group-demo',
  components: {
    'veui-radio-group': RadioGroup
  },
  data () {
    return {
      picked1: null,
      picked2: 'Nakano Azusa',
      data1: [
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa',
          label: 'Nakano Azusa'
        }
      ],
      data2: [
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui'
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio'
        },
        {
          value: 'Nakano Azusa',
          label: 'Nakano Azusa'
        }
      ]
    }
  }
}
</script>
