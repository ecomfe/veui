<template>
  <article>
    <h1><code>&lt;veui-date-picker&gt;</code></h1>
    <section>
      <h2>普通</h2>
      <p><veui-date-picker v-model="selected1"></veui-date-picker></p>
    </section>
    <section>
      <h2>禁用</h2>
      <p><veui-date-picker v-model="selected1" disabled></veui-date-picker></p>
    </section>
    <section>
      <h2>可清除选择</h2>
      <p><veui-date-picker v-model="selected1" clearable></veui-date-picker></p>
    </section>
    <section>
      <h2>范围选择</h2>
      <p><veui-date-picker v-model="selected2" range :shortcuts="shortcuts"></veui-date-picker></p>
    </section>
    <section>
      <h2>可清除范围选择</h2>
      <p><veui-date-picker v-model="selected2" range clearable :panel="3"></veui-date-picker></p>
    </section>
    <section>
      <h2>范围禁用</h2>
      <p><veui-date-picker v-model="selected2" range disabled></veui-date-picker></p>
    </section>
    <section style="height: 500px;"></section>
    <section>
      <h2>普通</h2>
      <p><veui-date-picker v-model="selected1"></veui-date-picker></p>
    </section>
    <section>
      <h2>可清除选择</h2>
      <p><veui-date-picker v-model="selected1" clearable></veui-date-picker></p>
    </section>
    <section>
      <h2>范围选择</h2>
      <p><veui-date-picker v-model="selected2" range></veui-date-picker></p>
    </section>
    <section>
      <h2>可清除范围选择</h2>
      <p><veui-date-picker v-model="selected2" range clearable :panel="3"></veui-date-picker></p>
    </section>
  </article>
</template>

<script>
import { DatePicker } from 'veui'

export default {
  name: 'date-picker-demo',
  components: {
    'veui-date-picker': DatePicker
  },
  data () {
    return {
      selected1: null,
      selected2: null,
      shortcuts: [
        {
          label: '上个月',
          from: {
            startOf: 'month',
            month: -1
          },
          to: {
            startOf: 'month',
            days: -1
          }
        },
        {
          label: '本月',
          from: {
            startOf: 'month'
          },
          to: 0
        },
        {
          label: '本周',
          from: {
            startOf: 'week',
            days: 0
          },
          to: 0
        },
        {
          label: '最近7天',
          from: -6,
          to: 0
        },
        {
          label: '今天',
          to: 0
        }
      ]
    }
  }
}
</script>
