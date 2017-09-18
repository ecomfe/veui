<template>
  <article>
    <h1><code>&lt;veui-check-button-group&gt;</code></h1>
    <section>
      <veui-checkbox v-model="disabled">禁用</veui-checkbox>
    </section>
    <section>
      <p>
        <veui-check-button-group :items="data1" v-model="picked1" :disabled="disabled">
          <template scope="props">{{ props.label }}</template>
        </veui-check-button-group>
      </p>
      <p>value: {{ picked1 }}</p>
    </section>
    <section>
      <p>
        <veui-check-button-group :items="data2" ui="small alt" v-model="picked2" :disabled="disabled">
          <template scope="props">{{ props.label }}</template>
        </veui-check-button-group>
      </p>
      <p>value: {{ picked2 }}</p>
    </section>
  </article>
</template>

<script>
import { CheckButtonGroup, Checkbox } from 'veui'

export default {
  name: 'check-button-group-demo',
  components: {
    'veui-check-button-group': CheckButtonGroup,
    'veui-checkbox': Checkbox
  },
  data () {
    return {
      picked1: ['Hirasawa Yui', 'Akiyama Mio'],
      picked2: [],
      disabled: false,
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
