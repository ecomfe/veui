<template>
<article>
  <h1>
    <code>&lt;veui-autocomplete&gt;</code>
  </h1>
  <section>
    <h2>普通</h2>
    <veui-autocomplete
      v-model="inputValue"
      :datasource="suggestions"
    />
  </section>
  <section>
    <h2>可清除</h2>
    <veui-autocomplete
      v-model="inputValue"
      ui="s"
      clearable
      :datasource="suggestions"
    />
  </section>
  <section>
    <h2>禁用</h2>
    <veui-autocomplete
      v-model="inputValue"
      ui="l"
      :datasource="suggestions"
      :suggest-trigger="['focus', 'input']"
      disabled
    />
  </section>
  <section>
    <h2>只读</h2>
    <veui-autocomplete
      v-model="inputValue"
      ui="xs"
      :datasource="suggestions"
      :suggest-trigger="['focus', 'input']"
      readonly
    />
  </section>
  <section>
    <h2>错误</h2>
    <veui-autocomplete
      v-model="inputValue"
      invalid
      :datasource="suggestions"
      :suggest-trigger="['focus', 'input']"
    />
  </section>
  <section>
    <h2>列表型数据，input 时下拉</h2>
    <veui-autocomplete
      v-model="value"
      :datasource="suggestions"
      placeholder="请输入"
    />
  </section>
  <section>
    <h2>树型数据，focus 时下拉</h2>
    <veui-autocomplete
      v-model="treeValue"
      :datasource="treeSuggestions"
      placeholder="请输入"
      suggest-trigger="focus"
    />
  </section>
  <section>
    <h2>strict: 下拉关闭时，强制清除不匹配值</h2>
    <veui-autocomplete
      v-model="treeValue"
      :datasource="treeSuggestions"
      placeholder="请输入"
      suggest-trigger="focus"
      strict
    />
  </section>
  <section>
    <h2>当成非受控组件使用</h2>
    <veui-autocomplete
      :datasource="suggestions"
      placeholder="请输入"
      suggest-trigger="focus"
      strict
    />
  </section>
  <veui-button @click="value = 'male'">设置list->male</veui-button>
  <veui-button @click="treeValue = 'male'">设置tree->male</veui-button>
  <veui-button @click="switchDatasource">切换数据源</veui-button>
</article>
</template>

<script>
import { Autocomplete, Button } from 'veui'

export default {
  name: 'autocomplete-demo',
  components: {
    'veui-autocomplete': Autocomplete,
    'veui-button': Button
  },
  data () {
    return {
      value: null,
      treeValue: '',
      inputValue: 'male',
      suggestions: [
        {
          value: 'male'
        },
        {
          value: 'female'
        }
      ],
      treeSuggestions: [
        {
          label: '组1',
          options: ['1', '11']
        },
        {
          label: '组2',
          options: [
            {
              label: '男组',
              options: [
                {
                  label: 'male',
                  value: 'male'
                }
              ]
            },
            {
              label: 'female',
              value: 'female'
            }
          ]
        }
      ]
    }
  },
  methods: {
    switchDatasource () {
      let tmp = this.suggestions
      this.suggestions = this.treeSuggestions
      this.treeSuggestions = tmp
    }
  }
}
</script>
