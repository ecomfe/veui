<template>
<article>
  <h1>
    <code>&lt;veui-radio-group&gt;</code>
  </h1>
  <p>
    <veui-checkbox v-model="disabled">禁用</veui-checkbox>
  </p>
  <p>
    <veui-radio-group
      v-model="picked1"
      :items="data1"
      :disabled="disabled"
      name="111"
    >
      <template #item="props">{{ props.label }}</template>
    </veui-radio-group>
  </p>
  <p>value: {{ picked1 }}</p>
  <p>
    <veui-radio-group
      v-model="picked2"
      :items="data2"
      :disabled="disabled"
      ui="s"
    >
      <template #item="props">{{ props.label }}</template>
      <template #desc>您没有权限！</template>
    </veui-radio-group>
  </p>
  <p>value: {{ picked2 }}</p>
  <p>
    <veui-radio-group v-model="picked3" :items="data3"/>
  </p>
  <p>value: {{ picked3 }}</p>
</article>
</template>

<script>
import { RadioGroup, Checkbox } from 'veui'

export default {
  name: 'radio-group-demo',
  components: {
    'veui-radio-group': RadioGroup,
    'veui-checkbox': Checkbox
  },
  data () {
    return {
      picked1: null,
      picked2: 'Nakano Azusa',
      picked3: null,
      disabled: false,
      data1: [
        {
          value: 'Hirasawa Yui',
          label: 'Hirasawa Yui',
          desc: "You don't have enough permissions!"
        },
        {
          value: 'Akiyama Mio',
          label: 'Akiyama Mio',
          desc: 'Something wrong!'
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
      ],
      data3: [
        {
          label: 'Steve Rogers',
          value: 'steve'
        },
        {
          label: 'Tony Stark',
          value: 'tony'
        },
        {
          label: 'Thor',
          value: 'thor'
        },
        {
          label: 'Hulk',
          value: 'hulk'
        },
        {
          label: 'Natasha Romanov',
          value: 'natasha'
        },
        {
          label: 'Stephen Strange',
          value: 'stephen'
        },
        {
          label: 'Peter Parker',
          value: 'peter'
        },
        {
          label: 'Vision',
          value: 'vision'
        },
        {
          label: 'Clint Barton',
          value: 'clint'
        },
        {
          label: 'Carol Danvers',
          value: 'carol'
        }
      ]
    }
  }
}
</script>
