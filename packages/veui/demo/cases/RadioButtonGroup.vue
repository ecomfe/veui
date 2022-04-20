<template>
<article>
  <h1>
    <code>&lt;veui-radio-button-group&gt;</code>
  </h1>
  <section>
    <veui-checkbox v-model="disabled">禁用</veui-checkbox>
  </section>
  <section>
    <p>
      <veui-radio-button-group
        v-model="picked1"
        :items="data1"
        :disabled="disabled"
      >
        <template #item="props">{{ props.label }}</template>
      </veui-radio-button-group>
    </p>
    <p>已选：{{ picked1 }}</p>
  </section>
  <section>
    <p>
      <veui-radio-button-group
        v-model="picked3"
        :items="data3"
        ui="s"
        :disabled="disabled"
      >
        <template #item="props">
          <i>{{ props.label }}</i>
        </template>
        <template #desc>您没有权限！</template>
      </veui-radio-button-group>
    </p>
    <p>已选：{{ picked3 }}</p>
  </section>
  <section>
    <h3>简单样式（simple）</h3>
    <p>
      <veui-radio-button-group
        v-model="picked3"
        :items="data3"
        :disabled="disabled"
        ui="simple"
      />
    </p>
    <h3>简单样式（simple s 最小宽度）</h3>
    <p>
      <veui-radio-button-group
        v-model="picked3"
        :items="data3"
        :disabled="disabled"
        ui="simple s stable"
      />
    </p>
    <p>已选: {{ picked3 }}</p>
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
      picked3: null,
      disabled: false,
      data1: [
        {
          value: 'pound',
          label: '£',
          desc: "You don't have enough permissions!"
        },
        {
          value: 'euro',
          label: '€',
          desc: 'Something wrong!'
        },
        {
          value: 'yen',
          label: '¥'
        }
      ],
      data3: [
        {
          value: 'jonathan',
          label: 'Jonathan Osterman'
        },
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
