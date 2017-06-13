<template>
  <article>
    <h1><code>&lt;veui-datepicker&gt;</code></h1>
    <section>
      <h2>普通</h2>
      <p><veui-datepicker v-model="selected1"></veui-datepicker></p>
    </section>
    <section>
      <h2>禁用</h2>
      <p><veui-datepicker v-model="selected1" disabled></veui-datepicker></p>
    </section>
    <section>
      <h2>可清除选择</h2>
      <p><veui-datepicker v-model="selected1" clearable></veui-datepicker></p>
    </section>
    <section>
      <h2>范围选择</h2>
      <p><veui-datepicker v-model="selected2" range></veui-datepicker></p>
    </section>
    <section>
      <h2>可清除范围选择</h2>
      <p><veui-datepicker v-model="selected2" range clearable :panel="3"></veui-datepicker></p>
    </section>
    <section>
      <h2>范围禁用</h2>
      <p><veui-datepicker v-model="selected2" range disabled></veui-datepicker></p>
    </section>
    <section style="height: 500px;"></section>
    <section>
      <h2>普通</h2>
      <p><veui-datepicker v-model="selected1"></veui-datepicker></p>
    </section>
    <section>
      <h2>可清除选择</h2>
      <p><veui-datepicker v-model="selected1" clearable></veui-datepicker></p>
    </section>
    <section>
      <h2>范围选择</h2>
      <p><veui-datepicker v-model="selected2" range></veui-datepicker></p>
    </section>
    <section>
      <h2>可清除范围选择</h2>
      <p><veui-datepicker v-model="selected2" range clearable :panel="3"></veui-datepicker></p>
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
      selected1: null,
      selected2: null
    }
  }
}
</script>
