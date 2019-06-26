<template>
<article>
  <h1><code>&lt;veui-button-group&gt;</code></h1>
  <section>
    <veui-checkbox
      v-model="disabled"
      ui="s"
    >
      禁用全部
    </veui-checkbox>
  </section>
  <section>
    <veui-checkbox
      v-model="items[2].disabled"
      ui="s"
    >
      禁用「删除」
    </veui-checkbox>
  </section>
  <section>
    <veui-radio-group
      v-model="size"
      ui="s"
      :items="sizes"
    />
  </section>
  <section>
    <veui-button-group
      :ui="`primary ${size}`"
      :items="items"
      :disabled="disabled"
    />
  </section>
  <section>
    <veui-button-group
      :ui="`strong ${size}`"
      :items="items"
      :disabled="disabled"
    />
  </section>
  <section>
    <veui-button-group
      :ui="size"
      :items="items"
      :disabled="disabled"
    />
  </section>
</article>
</template>

<script>
import { ButtonGroup, Checkbox, RadioGroup } from 'veui'

export default {
  name: 'button-group-demo',
  components: {
    'veui-button-group': ButtonGroup,
    'veui-checkbox': Checkbox,
    'veui-radio-group': RadioGroup
  },
  data () {
    return {
      disabled: false,
      size: '',
      sizes: [
        { label: '超大', value: 'xl' },
        { label: '大', value: 'l' },
        { label: '中', value: 'm' },
        { label: '小', value: 's' },
        { label: '超小', value: 'xs' }
      ],
      items: [
        { label: '新建', event: 'add' },
        { label: '编辑', event: 'edit' },
        { label: '删除', event: 'remove', disabled: true }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 20px;
}
</style>
