<template>
<article>
  <h1><code>&lt;veui-tag-input&gt;</code></h1>
  <section>
    <h2>默认</h2>
    <veui-tag-input
      v-model="teams"
      :datasource="teamSuggestion"
    />
  </section>
  <section>
    <h2>禁用</h2>
    <veui-tag-input
      v-model="teams1"
      :datasource="teamSuggestion"
      disabled
    />
  </section>
  <section>
    <h2>只读</h2>
    <veui-tag-input
      v-model="teams1"
      :datasource="teamSuggestion"
      readonly
    />
  </section>
  <section>
    <h2>严格模式：无法输入不匹配值</h2>
    <veui-tag-input
      v-model="teams2"
      :datasource="teamSuggestion"
      strict
    />
  </section>
  <section>
    <h2>宽松模式：任意输入</h2>
    <veui-tag-input
      v-model="teams3"
      :datasource="teamSuggestion"
    />
  </section>
  <section>
    <h2>focus 时展开推荐列表</h2>
    <veui-tag-input
      v-model="teams"
      :datasource="teamSuggestion"
      suggest-trigger="focus"
    />
  </section>
  <section>
    <h2>input 时展开推荐列表</h2>
    <veui-tag-input
      v-model="teams"
      :datasource="teamSuggestion"
      suggest-trigger="focus"
    />
  </section>
  <section>
    <h2>监听移除 Tag 事件</h2>
    <veui-tag-input
      v-model="teams4"
      :datasource="teamSuggestion"
      @removetag="handleClose"
    />
  </section>
</article>
</template>

<script>
import { TagInput } from 'veui'
import toastManagers from 'veui/managers/toast'

export default {
  name: 'tag-input-demo',
  components: {
    'veui-tag-input': TagInput
  },
  data () {
    return {
      teamSuggestion: [
        {
          value: '湖人'
        },
        {
          value: '快船'
        },
        {
          value: '小牛'
        },
        {
          value: '金州勇士'
        },
        {
          value: '马刺'
        },
        {
          value: '猛龙'
        },
        {
          value: '开拓者'
        },
        {
          value: '休斯顿火箭'
        }
      ],
      teams: null,
      teams1: ['金州勇士', '猛龙'],
      teams2: ['开拓者', '休斯顿火箭'],
      teams3: ['小牛'],
      teams4: ['雄鹿', '掘金', '热火', '骑士']
    }
  },
  methods: {
    handleClose (name) {
      toastManagers.success(`成功淘汰：${name}`)
    }
  }
}
</script>
