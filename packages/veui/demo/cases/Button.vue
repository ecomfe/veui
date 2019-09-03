<template>
<article>
  <h1><code>&lt;veui-button&gt;</code></h1>
  <p>
    <veui-button ui="xs">
      保存
    </veui-button>
    <veui-button ui="s">
      保存
    </veui-button>
    <veui-button>
      保存
    </veui-button>
    <veui-button ui="l">
      保存
    </veui-button>
    <veui-button ui="xl">
      保存
    </veui-button>
    <veui-button disabled>
      保存
    </veui-button>
    <veui-button loading>
      保存
    </veui-button>
  </p>
  <p>
    <veui-button ui="strong xs">
      保存
    </veui-button>
    <veui-button ui="strong s">
      保存
    </veui-button>
    <veui-button ui="strong">
      保存
    </veui-button>
    <veui-button ui="strong l">
      保存
    </veui-button>
    <veui-button ui="strong xl">
      保存
    </veui-button>
    <veui-button
      ui="strong"
      disabled
    >
      保存
    </veui-button>
    <veui-button
      ui="strong"
      loading
    >
      保存
    </veui-button>
  </p>
  <p>
    <veui-button ui="primary xs">
      提交
    </veui-button>
    <veui-button ui="primary s">
      提交
    </veui-button>
    <veui-button ui="primary">
      提交
    </veui-button>
    <veui-button ui="primary l">
      提交
    </veui-button>
    <veui-button ui="primary xl">
      提交
    </veui-button>
    <veui-button
      ui="primary"
      disabled
    >
      提交
    </veui-button>
    <veui-button
      ui="primary"
      loading
    >
      提交
    </veui-button>
  </p>
  <p>
    <veui-button ui="xs"> <veui-icon name="times"/>取消 </veui-button>
    <veui-button ui="s"> <veui-icon name="times"/>取消 </veui-button>
    <veui-button @click="text = !text">
      <veui-icon name="times"/><template
        v-if="text"
      >取消</template>
    </veui-button>
    <veui-button ui="l"> <veui-icon name="times"/>取消 </veui-button>
    <veui-button ui="xl"> <veui-icon name="times"/>取消 </veui-button>
    <veui-button disabled> <veui-icon name="times"/>取消 </veui-button>
    <veui-button loading> <veui-icon name="times"/>取消 </veui-button>
  </p>
  <p>
    <veui-button ui="translucent xs">
      取消
    </veui-button>
    <veui-button ui="translucent s">
      取消
    </veui-button>
    <veui-button ui="translucent">
      取消
    </veui-button>
    <veui-button ui="translucent l">
      取消
    </veui-button>
    <veui-button ui="translucent xl">
      取消
    </veui-button>
    <veui-button
      ui="translucent"
      disabled
    >
      取消
    </veui-button>
    <veui-button
      ui="translucent"
      loading
    >
      取消
    </veui-button>
  </p>
  <p>
    <veui-button ui="text xs">
      编辑
    </veui-button>
    <veui-button ui="text s">
      编辑
    </veui-button>
    <veui-button ui="text">
      编辑
    </veui-button>
    <veui-button ui="text l">
      编辑
    </veui-button>
    <veui-button ui="text xl">
      编辑
    </veui-button>
    <veui-button
      ui="text"
      disabled
    >
      编辑
    </veui-button>
    <veui-button
      ui="text"
      loading
    >
      编辑
    </veui-button>
  </p>
  <p>
    <veui-button ui="icon xs">
      <veui-icon name="search"/>
    </veui-button>
    <veui-button ui="icon s">
      <veui-icon name="search"/>
    </veui-button>
    <veui-button ui="icon">
      <veui-icon name="search"/>
    </veui-button>
    <veui-button ui="icon l">
      <veui-icon name="search"/>
    </veui-button>
    <veui-button ui="icon xl">
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      disabled
    >
      <veui-icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      loading
    >
      <veui-icon name="search"/>
    </veui-button>
  </p>
</article>
</template>

<script>
import bus from '../bus'
import { Button, Icon } from 'veui'
import 'veui-theme-dls-icons/check'
import 'veui-theme-one-icons/edit'
import 'veui-theme-dls-icons/search'
import 'veui-theme-dls-icons/times'

export default {
  name: 'button-demo',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  data () {
    return {
      text: false
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  }
}
</script>

<style scoped>
p {
  user-select: none;
  display: flex;
  align-items: center;
}

.veui-button {
  margin-right: 10px;
}
</style>
