<template>
<article>
  <h1><code>&lt;veui-radio-button-group&gt;</code></h1>
  <section>
    <veui-checkbox v-model="disabled">
      禁用
    </veui-checkbox>
  </section>
  <section>
    <p>
      <veui-radio-button-group
        v-model="picked1"
        :items="data1"
        :disabled="disabled"
      >
        <template #item="props">
          {{ props.label }}
        </template>
      </veui-radio-button-group>
    </p>
    <p>已选：{{ picked1 }}</p>
  </section>
  <section>
    <p>
      <veui-radio-button-group
        v-model="picked2"
        :items="data2"
        ui="s"
        :disabled="disabled"
      >
        <template
          slot="item"
          slot-scope="props"
        >
          <i>{{ props.label }}</i>
        </template>
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
      picked2: null,
      disabled: false,
      data1: [
        {
          value: 'pound',
          label: '£'
        },
        {
          value: 'euro',
          label: '€'
        },
        {
          value: 'yen',
          label: '¥'
        }
      ],
      data2: [
        {
          value: 'bidu',
          label: '百度'
        },
        {
          value: 'baba',
          label: '阿里'
        },
        {
          value: 'qq',
          label: '腾讯'
        }
      ]
    }
  }
}
</script>
