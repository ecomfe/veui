<template>
  <article>
    <h1><code>&lt;veui-datepicker&gt;</code></h1>
    <section>
      <veui-datepicker></veui-datepicker>
      <veui-datepicker></veui-datepicker>
    </section>
  </article>
</template>

<script>
import DatePicker from '@/components/DatePicker'

export default {
  name: 'datepicker-demo',
  components: {
    'veui-datepicker': DatePicker
  }
}
</script>
