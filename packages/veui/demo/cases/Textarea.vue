<template>
<article>
  <h1><code>&lt;veui-textarea&gt;</code></h1>
  <section>
    <h3>小尺寸 + 默认显示 3 行 + 允许手动 resize</h3>
    <veui-textarea
      v-model="value"
      line-number
      autofocus
      ui="s"
      rows="3"
      resizable
    />
  </section>
  <section>
    <h3>默认尺寸 + 行号 + 自动扩展</h3>
    <veui-textarea
      v-model="value"
      line-number
      select-on-focus
      autoresize
      placeholder="请输入"
    />
  </section>
  <section>
    <h3>自动扩展</h3>
    <veui-textarea
      v-model="value"
      autoresize
    />
  </section>
  <section>
    <h3>只读样式</h3>
    <veui-textarea
      v-model="value"
      readonly
    />
  </section>
  <section>
    <h3>禁用样式</h3>
    <veui-textarea
      v-model="value"
      disabled
    />
  </section>
  <section>
    <h3>错误样式</h3>
    <veui-textarea
      v-model="value"
      invalid
    />
  </section>

  <section>
    <h3>字数限制显示</h3>
    <section>
      <veui-textarea
        placeholder="不允许溢出"
        maxlength="5"
        strict
      />
    </section>
    <section>
      <veui-textarea
        placeholder="允许溢出"
        maxlength="5"
        rows="2"
        line-number
        value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis inventore non cumque vero eligendi? Iure ex sint aut. Facilis doloribus facere ducimus consequatur ipsa reiciendis voluptates minima molestiae deserunt nemo."
      />
    </section>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Textarea } from 'veui'

export default {
  name: 'button-demo',
  components: {
    'veui-textarea': Textarea
  },
  data () {
    return {
      value: ''
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

<style scoped></style>
