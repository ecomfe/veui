<template>
  <article>
    <h1><code>&lt;veui-tooltip&gt;</code></h1>
    <p>
      <veui-tooltip align="left" position="top" ui="light" target="topLeft" :open="open"><span slot="button">上左</span>提示文字</veui-tooltip>
      <veui-tooltip align="right" position="top" ui="light" target="topLeft" :open="open"><span slot="button">上右</span>提示文字</veui-tooltip>
    </p>
    <p>
      <veui-tooltip align="left" position="bottom" ui="light" target="topLeft" :open="open"><span slot="button">下右</span>提示文字</veui-tooltip>
      <veui-tooltip align="right" position="bottom" ui="light" target="topLeft" :open="open"><span slot="button">下右</span>提示文字</veui-tooltip>
    </p>
    <p>
      <veui-tooltip align="top" position="left" ui="light" target="topLeft" :open="open"><span slot="button">左上</span>提示文字</veui-tooltip>
      <veui-tooltip align="bottom" position="left" ui="light" target="topLeft" :open="open"><span slot="button">左下</span>提示文字</veui-tooltip>
    </p>
    <p>
      <veui-tooltip align="top" position="right" ui="light" target="topLeft" :open="open"><span slot="button">右上</span>提示文字</veui-tooltip>
      <veui-tooltip align="bottom" position="right" ui="light" target="topLeft" :open="open"><span slot="button">右下</span>提示文字</veui-tooltip>
    </p>
    <p>
      <veui-tooltip align="top" position="right" ui="light" target="topLeft" :open="open"><span slot="button">右上</span>提示文字</veui-tooltip>
      <veui-tooltip align="bottom" position="right" ui="light" target="topLeft" :open="open"><span slot="button">右下</span>提示文字</veui-tooltip>
    </p>
  </article>
</template>

<script>
import bus from '../bus'
import Tooltip from '@/components/Tooltip'

export default {
  name: 'tooltip-demo',
  data () {
    return {
      open: false
    }
  },
  components: {
    'veui-tooltip': Tooltip
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
  margin: 30px 0;
}
</style>
