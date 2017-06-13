<template>
  <article class="veui-demo-calendar">
    <h1><code>&lt;veui-calendar&gt;</code></h1>
    <section>
      <h2>单日选择</h2>
      <veui-calendar v-model="selected1" :disabled-date="isDisabled"></veui-calendar>
    </section>
    <section>
      <h2>禁用</h2>
      <veui-calendar v-model="selected1" disabled></veui-calendar>
    </section>
    <section>
      <h2>多单日选择 <small>(<code>multiple</code>)</small></h2>
      <veui-calendar v-model="selected0" multiple :date-class="dateClass"></veui-calendar>
    </section>
    <section>
      <h2>时间段选择 <small>(<code>range</code>)</small></h2>
      <veui-calendar v-model="selected2" range :panel="2" :is-disabled-date="isDisabled"></veui-calendar>
    </section>
    <section>
      <h2>多时间段选择 <small>(<code>multiple</code> &amp; <code>range</code>)</small></h2>
      <veui-calendar v-model="selected3" range multiple :panel="3"></veui-calendar>
    </section>
  </article>
</template>

<script>
import Calendar from '@/components/Calendar'

export default {
  name: 'calendar-demo',
  components: {
    'veui-calendar': Calendar
  },
  data () {
    let today = new Date()
    return {
      selected0: null,
      selected1: new Date(1987, 6, 11),
      selected2: [today, new Date(today.getFullYear(), today.getMonth() + 1, 13)],
      selected3: [ [ new Date(2017, 3, 12), new Date(2017, 3, 18) ], [ new Date(2017, 3, 22), new Date(2017, 3, 24) ] ],
      isDisabled (day) {
        return !(day.getDate() % 5)
      },
      dateClass (day) {
        if ((day.getDay() + 1) % 7 < 2) {
          return {
            'veui-calendar-weekend': true
          }
        }
        return {}
      }
    }
  }
}
</script>

<style lang="less">
@import "../../src/styles/theme-default/lib.less";

.veui-demo-calendar {
  section {
    .clearfix();
    margin-bottom: 10px;
  }

  .veui-calendar {
    float: left;
    margin-right: 10px;

    &-weekend:not(.veui-calendar-selected) {
      button {
        background-color: tint(rebeccapurple, 90%);
      }
    }
  }
}
</style>
