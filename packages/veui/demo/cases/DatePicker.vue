<template>
<article>
  <h1>
    <code>&lt;veui-date-picker&gt;</code>
  </h1>
  <section>
    <h2>日期选择</h2>
    <veui-date-picker
      v-model="selectedDate"
      clearable
    />
  </section>
  <section>
    <h2>日期范围选择</h2>
    <veui-date-picker
      v-model="selectedDateRange"
      clearable
      range
      format="MM/DD/YYYY"
    />
  </section>
  <section>
    <h2>日期范围选择（快捷）</h2>
    <veui-date-picker
      v-model="selectedDateRange"
      range
      :shortcuts="shortcuts"
    />
  </section>
  <section>
    <h2>月份选择</h2>
    <veui-date-picker
      v-model="selectedMonth"
      type="month"
    />
  </section>
  <section>
    <h2>月份范围选择</h2>
    <veui-date-picker
      v-model="selectedMonthRange"
      type="month"
      range
    />
  </section>
  <section>
    <h2>年份选择</h2>
    <veui-date-picker
      v-model="selectedYear"
      type="year"
    />
  </section>
  <section>
    <h2>年份范围选择</h2>
    <veui-date-picker
      v-model="selectedYearRange"
      type="year"
      range
    />
  </section>
  <section>
    <h2>小尺寸日期范围</h2>
    <veui-date-picker
      v-model="selectedDateRange"
      clearable
      range
      ui="s"
    />
  </section>
  <section>
    <h2>小尺寸月份范围</h2>
    <veui-date-picker
      v-model="selectedDateRange"
      clearable
      range
      type="month"
      ui="s"
    />
  </section>
  <section>
    <h2>小尺寸年份范围</h2>
    <veui-date-picker
      v-model="selectedDateRange"
      clearable
      range
      type="year"
      ui="s"
    />
  </section>
  <section>
    <h2>禁用</h2>
    <section>
      <veui-date-picker
        v-model="selectedDate"
        disabled
      />
    </section>
  </section>
  <section>
    <h2>invalid</h2>
    <section>
      <veui-date-picker
        v-model="selectedDate"
        class="veui-invalid"
      />
    </section>
  </section>
  <section>
    <h2>范围禁用</h2>
    <section>
      <veui-date-picker
        v-model="selectedDateRange"
        range
        disabled
      />
    </section>
  </section>
  <section>
    <h2>范围readonly</h2>
    <section>
      <veui-date-picker
        v-model="selectedDateRange"
        range
        readonly
      />
    </section>
  </section>
  <section>
    <h2>
      作用域插槽
      <code>date</code>
    </h2>
    <section>
      <veui-date-picker
        v-model="selectedDateRange"
        range
      >
        <template
          slot="date"
          slot-scope="{ date }"
        >
          <em>{{ date }}</em>
        </template>
      </veui-date-picker>
    </section>
  </section>
  <section style="height: 500px;"/>

  <section>
    <h2>可清除选择</h2>
    <section>
      <veui-date-picker
        v-model="selectedDate"
        clearable
      />
    </section>
  </section>
  <section>
    <h2>可清除范围选择</h2>
    <section>
      <veui-date-picker
        v-model="selectedDateRange"
        range
        clearable
      />
    </section>
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
      selectedDate: null,
      selectedMonth: null,
      selectedYear: null,
      selectedDateRange: [new Date(2019, 9, 10), new Date(2019, 11, 10)],
      selectedMonthRange: null,
      selectedYearRange: null,
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

<style lang="less" scoped>
section {
  margin-bottom: 20px;
}
</style>
