<template>
  <article>
    <h1><code>&lt;veui-calendar&gt;</code></h1>
    <section>
      <veui-calendar :selected="selected1" @select="selected1 = arguments[0]"></veui-calendar>
    </section>
    <section>
      <veui-calendar :selected="selected2" @select="selected2 = arguments[0]" range :panel="3"></veui-calendar>
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
      selected1: new Date(1987, 6, 11),
      selected2: [new Date(1987, 6, 11), new Date(1987, 6, 14)]
    }
  }
}
</script>
