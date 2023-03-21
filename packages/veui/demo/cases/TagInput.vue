<template>
<article>
  <h1>
    <code>&lt;veui-tag-input&gt;</code>
  </h1>
  <section>{{ tags }}</section>
  <section>
    <h4>max + maxlength + allow-duplicate</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      ui="xs"
      :max="3"
      :maxlength="5"
      allow-duplicate
      :input-value.sync="value"
      @change="handleChange"
    />
  </section>
  <section>
    <h4>select-on-focus</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      select-on-focus
      ui="s"
      :input-value.sync="value"
    />
  </section>
  <section>
    <h4>get-length + maxlength</h4>
    <veui-tag-input
      v-model="tags"
      :get-length="(val) => val.length * 2"
      :maxlength="10"
      placeholder="请输入"
      :input-value.sync="value"
    />
  </section>
  <section>
    <h4>clearable + autofocus</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      clearable
      autofocus
      ui="l"
      :input-value.sync="value"
    />
  </section>
  <section>
    <h4>readonly</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      readonly
      :input-value.sync="value"
    />
  </section>
  <section>
    <h4>disabled</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      disabled
      :input-value.sync="value"
    />
  </section>
  <section>
    <h4>clearable + inline</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      clearable
      ui="inline"
      :input-value.sync="value"
    />
  </section>
  <section>
    <h4>clearable + max</h4>
    <veui-tag-input
      v-model="tags"
      placeholder="请输入"
      clearable
      :max="5"
      :input-value.sync="value"
    />
  </section>
</article>
</template>

<script>
import { TagInput } from 'veui'

export default {
  name: 'tag-input-demo',
  components: {
    'veui-tag-input': TagInput
  },
  data () {
    return {
      tags: ['一言', '一格', '快跑'],
      value: ''
    }
  },
  methods: {
    handleChange (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped>
section {
  margin: 30px;
}
</style>
