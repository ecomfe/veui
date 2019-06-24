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
    <veui-button ui="xs">
      <icon name="times"/>取消
    </veui-button>
    <veui-button ui="s">
      <icon name="times"/>取消
    </veui-button>
    <veui-button> <icon name="times"/>取消 </veui-button>
    <veui-button ui="l">
      <icon name="times"/>取消
    </veui-button>
    <veui-button ui="xl">
      <icon name="times"/>取消
    </veui-button>
    <veui-button disabled>
      <icon name="times"/>取消
    </veui-button>
    <veui-button loading>
      <icon name="times"/>取消
    </veui-button>
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
      <icon name="search"/>
    </veui-button>
    <veui-button ui="icon s">
      <icon name="search"/>
    </veui-button>
    <veui-button ui="icon">
      <icon name="search"/>
    </veui-button>
    <veui-button ui="icon l">
      <icon name="search"/>
    </veui-button>
    <veui-button ui="icon xl">
      <icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      disabled
    >
      <icon name="search"/>
    </veui-button>
    <veui-button
      ui="icon"
      loading
    >
      <icon name="search"/>
    </veui-button>
  </p>
</article>
</template>

<script>
import bus from '../bus'
import { Button, Icon } from 'veui'
import 'veui-theme-one-icons/check'
import 'veui-theme-one-icons/edit'
import 'veui-theme-one-icons/search'
import 'veui-theme-one-icons/times'

export default {
  name: 'button-demo',
  components: {
    Icon,
    'veui-button': Button
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
}

.veui-button {
  margin-right: 10px;
}
</style>
