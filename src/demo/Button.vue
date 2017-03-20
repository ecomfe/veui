<template>
  <article>
    <h1><code>&lt;veui-button&gt;</code></h1>
    <p>
      <veui-button ui="primary small">确定</veui-button>
      <veui-button ui="primary">确定</veui-button>
      <veui-button ui="primary large" disabled>确定</veui-button>
      <veui-button ui="primary">有很长陈长很长很长的文字</veui-button>
    </p>
    <p>
      <veui-button ui="small">按钮样式</veui-button>
      <veui-button>按钮样式</veui-button>
      <veui-button ui="large" disabled>按钮样式</veui-button>
      <veui-button loading>按钮样式</veui-button>
    </p>
    <p>
      <veui-button ui="aux small">按钮样式</veui-button>
      <veui-button ui="aux">按钮样式</veui-button>
      <veui-button ui="aux large" disabled>按钮样式</veui-button>
    </p>
    <p>
      <veui-button ui="round primary large">V</veui-button>
      <veui-button ui="round">E</veui-button>
      <veui-button ui="round small">U</veui-button>
      <veui-button ui="round small">I</veui-button>
    </p>
  </article>
</template>

<script>
import bus from './bus'
import Button from '@/components/Button'

export default {
  name: 'button',
  components: {
    'veui-button': Button
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', ({target}) => {
        bus.$emit('log', target.getAttribute('ui'))
      })
    })
  }
}
</script>
