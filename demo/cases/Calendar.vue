<template>
  <article>
    <h1><code>&lt;veui-calendar&gt;</code></h1>
    <section>
      <veui-calendar v-model="selected1" :is-disabled-date="isDisabled"></veui-calendar>
    </section>
    <section>
      <veui-calendar v-model="selected2" range :panel="3" :is-disabled-date="isDisabled"></veui-calendar>
    </section>
    <section>
      <veui-calendar v-model="selected3" range multiple :panel="2"></veui-calendar>
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
    let today = new Date()
    return {
      selected1: new Date(1987, 6, 11),
      selected2: [today, new Date(today.getFullYear(), today.getMonth() + 1, 13)],
      selected3: [ [ new Date(2017, 3, 12), new Date(2017, 3, 18) ], [ new Date(2017, 3, 22), new Date(2017, 3, 24) ] ],
      isDisabled (day) {
        return !(day.getDate() % 5)
      }
    }
  }
}
</script>
