<template>
<article>
  <h1><code>&lt;veui-checkbox&gt;</code></h1>
  <section>
    <veui-checkbox>未绑定数据</veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="current"
      true-value="已选"
      false-value="未选"
    >
      当前数据：
    </veui-checkbox> {{ current }}
  </section>
  <section>
    <veui-checkbox v-model="picked1">
      正常状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked2"
      ui="small"
    >
      正常状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox v-model="picked3">
      选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked4"
      ui="small"
    >
      选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked5"
      :indeterminate="indeterminate5"
      @change="indeterminate5 = false"
    >
      部分选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked6"
      ui="small"
      :indeterminate="indeterminate6"
      @change="indeterminate6 = false"
    >
      部分选中状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked7"
      disabled
    >
      选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked8"
      ui="small"
      disabled
    >
      选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked9"
      disabled
    >
      未选无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked10"
      ui="small"
      disabled
    >
      未选无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked11"
      disabled
      indeterminate
    >
      部分选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="picked12"
      ui="small"
      disabled
      indeterminate
    >
      部分选中无效状态
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      :checked="checked13"
      @change="checked13 = $event"
    >
      外部控制 <code>checked</code>
    </veui-checkbox>
  </section>
</article>
</template>

<script>
import { Checkbox } from 'veui'

export default {
  name: 'checkbox-demo',
  components: {
    'veui-checkbox': Checkbox
  },
  data () {
    return {
      current: '已选',
      picked1: false,
      picked2: false,
      picked3: true,
      picked4: true,
      picked5: true,
      indeterminate5: true,
      picked6: false,
      indeterminate6: true,
      picked7: true,
      picked8: true,
      picked9: false,
      picked10: false,
      picked11: false,
      picked12: false,
      checked13: true
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 1em;
}
</style>
