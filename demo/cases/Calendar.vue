<template>
  <article>
    <h1><code>&lt;veui-calendar&gt;</code></h1>
    <section>
      <veui-calendar :selected="selected" @select="selected = arguments[0]"></veui-calendar>
    </section>
    <section>
      <veui-calendar :selected="selected" @select="selected = arguments[0]" range :panel="3"></veui-calendar>
    </section>
  </article>
</template>

<script>
import Calendar from '@/components/Calendar'

export default {
  name: 'table',
  components: {
    'veui-calendar': Calendar
  },
  data () {
    return {
      selected: null
    }
  }
}
</script>
