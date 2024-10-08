<template>
<article>
  <veui-config-provider :value="{ 'datepicker.placeholder': '撞日' }">
    <h1>
      <code>&lt;veui-date-picker&gt;</code>
    </h1>
    <section>
      <h2>非受控组件</h2>
      <veui-date-picker
        range
        clearable
        :overlay-style="{
          '--dls-dropdown-max-display-items': 8
        }"
      />
    </section>
    <section>
      <h2>日期选择</h2>
      <veui-date-picker v-model="selectedDate" clearable/>
    </section>
    <section>
      <h2>日期范围选择</h2>
      <veui-date-picker
        v-model="selectedDateRange"
        clearable
        range
        format="MM/dd/yyyy"
      />
    </section>
    <section>
      <h2>日期范围选择（3天限制）</h2>
      <veui-date-picker
        clearable
        :disabled-date="disabledRange"
        range
        format="yyyy-MM-dd"
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
      <veui-date-picker v-model="selectedMonth" type="month"/>
    </section>
    <section>
      <h2>月份范围选择</h2>
      <veui-date-picker v-model="selectedMonthRange" type="month" range/>
    </section>
    <section>
      <h2>年份选择</h2>
      <veui-date-picker v-model="selectedYear" type="year"/>
    </section>
    <section>
      <h2>年份范围选择</h2>
      <veui-date-picker v-model="selectedYearRange" type="year" range/>
    </section>
    <section>
      <h2>小尺寸日期范围</h2>
      <veui-date-picker v-model="selectedDateRange" clearable range ui="s"/>
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
        <veui-date-picker v-model="selectedDate" disabled/>
      </section>
    </section>
    <section>
      <h2>禁用特定日期</h2>
      <section>
        <veui-date-picker
          v-model="selectedDate"
          :disabled-date="disabledDate"
        />
      </section>
    </section>
    <section>
      <h2>invalid</h2>
      <section>
        <veui-date-picker v-model="selectedDate" class="veui-invalid"/>
      </section>
    </section>
    <section>
      <h2>范围禁用</h2>
      <section>
        <veui-date-picker v-model="selectedDateRange" range disabled/>
      </section>
    </section>
    <section>
      <h2>范围readonly</h2>
      <section>
        <veui-date-picker v-model="selectedDateRange" range readonly/>
      </section>
    </section>
    <section>
      <h2>
        作用域插槽
        <code>date</code>
      </h2>
      <section>
        <veui-date-picker v-model="selectedDateRange" range>
          <template #date="{ date }">
            <em>{{ date }}</em>
          </template>
        </veui-date-picker>
      </section>
    </section>
    <section style="height: 500px"/>

    <section>
      <h2>可清除选择</h2>
      <section>
        <veui-date-picker v-model="selectedDate" clearable/>
      </section>
    </section>
    <section>
      <h2>可清除范围选择</h2>
      <section>
        <veui-date-picker v-model="selectedDateRange" range clearable/>
      </section>
    </section>
    <section>
      <h2>before slot</h2>
      <section>
        <veui-date-picker v-model="selectedDateRange" range clearable>
          <template #before> before </template>
        </veui-date-picker>
      </section>
    </section>
  </veui-config-provider>
</article>
</template>

<script>
import { DatePicker, ConfigProvider } from 'veui'
import add from 'date-fns/add'
import startOfDay from 'date-fns/startOfDay'

export default {
  name: 'date-picker-demo',
  components: {
    'veui-date-picker': DatePicker,
    'veui-config-provider': ConfigProvider
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
            months: -1
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
  },
  methods: {
    disabledDate (date) {
      return date > new Date()
    },
    disabledRange (date, selected) {
      let today = startOfDay(new Date())
      let maxEnd = add(today, { days: 4 })
      let middle = add(today, { days: 2 })
      if (selected == null) {
        return date < today || date > maxEnd
      } else if (selected <= middle) {
        maxEnd = add(selected, { days: 2 })
        return !(date >= today && date <= maxEnd)
      }
      let minStart = add(selected, { days: -2 })
      return !(date >= minStart && date <= maxEnd)
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 20px;
}
</style>
