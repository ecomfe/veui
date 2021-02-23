<template>
<article>
  <h1><code>&lt;veui-link&gt;</code></h1>
  <section>
    <veui-link to="button">Button</veui-link>
    &larr; default
    <veui-link
      ui="s"
      to="button"
    >Button</veui-link>
    &larr; small
    <veui-link
      ui="m"
      to="button"
    >Button</veui-link>
    &larr; middle
  </section>
  <section>
    <veui-link
      ui="strong"
      to="button"
    >Button</veui-link>
    &larr; strong
  </section>
  <section>
    <veui-link
      to="/dialog"
      native
    >Dialog</veui-link>
    &larr; <code>native</code>
  </section>
  <section>
    <veui-link
      to="https://www.baidu.com/"
      target="_blank"
      rel="next"
    >Baidu.com</veui-link>
    &larr; <code>native</code> &amp; <code>target="_blank"</code>
  </section>
  <section>
    <veui-link
      to="https://www.baidu.com/"
      native
      target="_blank"
      rel="next"
    >Baidu.com</veui-link>
    &larr; absolute to
  </section>
  <section>
    <veui-link
      to="icon"
      disabled
    >Icon</veui-link>
    &larr; <code>disabled</code>
  </section>
  <section>
    <veui-link>Nowhere</veui-link> &larr; fallback to
    <code>&lt;span&gt;</code>
  </section>
</article>
</template>

<script>
import { Link } from 'veui'

export default {
  name: 'link-demo',
  components: {
    'veui-link': Link
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 10px;
}
</style>
