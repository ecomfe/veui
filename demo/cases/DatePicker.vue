<template>
  <article>
    <h1><code>&lt;veui-datepicker&gt;</code></h1>
    <section>
      <p><veui-datepicker v-model="selected"></veui-datepicker></p>
    </section>
    <section>
      <p><veui-datepicker v-model="selected"></veui-datepicker></p>
    </section>
  </article>
</template>

<script>
import DatePicker from '@/components/DatePicker'

export default {
  name: 'datepicker-demo',
  components: {
    'veui-datepicker': DatePicker
  },
  data () {
    return {
      selected: null
    }
  }
}
</script>
