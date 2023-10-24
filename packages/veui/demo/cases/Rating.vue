<template>
<article>
  <h1>
    <code>&lt;veui-stack&gt;</code>
  </h1>
  <veui-stack direction="column" gap="m">
    <veui-stack gap="s">
      <veui-checkbox v-model="clearable" ui="s">可清除</veui-checkbox>
      <veui-checkbox v-model="readonly" ui="s">只读</veui-checkbox>
      <veui-radio-button-group
        v-model="labelPosition"
        ui="s"
        :items="labelPositions"
      />
    </veui-stack>
    <section>
      <h3>带标签</h3>
      <veui-rating
        :clearable="clearable"
        :readonly="readonly"
        :labels="labels"
        :label-position="labelPosition"
      />
    </section>
    <section>
      <h3>带标签，允许半星</h3>
      <veui-rating
        :clearable="clearable"
        :readonly="readonly"
        allow-half
        :labels="labels"
        :label-position="labelPosition"
      />
    </section>
    <section>
      <h3>最大值</h3>
      <veui-rating
        :clearable="clearable"
        :readonly="readonly"
        :max="3"
        :labels="labels"
        :label-position="labelPosition"
      />
    </section>
    <section>
      <h3>自定义符号</h3>
      <veui-rating>
        <template #symbol>♥︎</template>
      </veui-rating>
    </section>
  </veui-stack>
</article>
</template>

<script>
import { Stack, Checkbox, RadioButtonGroup, Rating } from 'veui'

export default {
  name: 'rating-demo',
  components: {
    'veui-stack': Stack,
    'veui-checkbox': Checkbox,
    'veui-radio-button-group': RadioButtonGroup,
    'veui-rating': Rating
  },
  data () {
    return {
      labels: {
        1: '很差',
        1.5: '差',
        2: '较差',
        2.5: '一般',
        3: '还行',
        3.5: '好',
        4: '很好',
        4.5: '非常好',
        5: '极好'
      },
      labelPositions: [
        {
          label: '行内',
          value: 'inline'
        },
        {
          label: '弹出',
          value: 'popup'
        }
      ],
      clearable: false,
      readonly: false,
      labelPosition: 'inline'
    }
  }
}
</script>
