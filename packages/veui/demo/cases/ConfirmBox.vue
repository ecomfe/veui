<template>
<article class="confirm-box-demo">
  <h1>
    <code>&lt;veui-confirm-box&gt;</code>
  </h1>
  <p>
    <veui-button
      ui="primary"
      @click="confirmOpen = true"
    >open confirm</veui-button>
    <veui-confirm-box
      :open.sync="confirmOpen"
      :overlay-style="{
        '--dls-dropdown-max-display-items': 8
      }"
    >
      <template #title>弹窗标题</template>
      <p>
        这是一个对话框弹窗，这是一个对话框弹窗，这是一个对话框弹窗，这是一个对话框弹窗……
      </p>
      <p>你要关闭它吗？</p>
    </veui-confirm-box>
  </p>
</article>
</template>

<script>
import { ConfirmBox, Button } from 'veui'

export default {
  components: {
    'veui-confirm-box': ConfirmBox,
    'veui-button': Button
  },
  data () {
    return {
      confirmOpen: false
    }
  }
}
</script>
