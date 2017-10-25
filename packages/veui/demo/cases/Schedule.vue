<template>
  <article>
    <h1><code>&lt;veui-schedule&gt;</code></h1>
    <section>
      <veui-schedule :selected="selected"></veui-schedule>
    </section>
  </article>
</template>

<script>
import { Schedule } from 'veui'

export default {
  name: 'demo-schedule',
  components: {
    'veui-schedule': Schedule
  },
  data () {
    return {
      selected: {
        0: [ [0, 23] ],           // 周日
        1: [ [9, 11], [13, 17] ], // 周一
        3: [ [13, 16] ],          // 周三
        5: [ [9, 9], [16, 17] ]   // 周五
      },
      isDisabled (day, hour) {
        return day === 2 && hour > 11 && hour < 14
      }
    }
  }
}
</script>
