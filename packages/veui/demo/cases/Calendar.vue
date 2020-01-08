<template>
<article class="veui-demo-calendar">
  <h1><code>&lt;veui-calendar&gt;</code></h1>
  <section>
    <h2>日期选择</h2>
    <veui-calendar
      v-model="singleDate"
      type="date"
      :disabled-date="isDisabled"
    />
  </section>
  <section>
    <h2>日期多选</h2>
    <veui-calendar
      v-model="multipleDate"
      type="date"
      multiple
    />
  </section>
  <section>
    <h2>日期范围单选(small)</h2>
    <veui-calendar
      v-model="singleDateRange"
      type="date"
      range
      :panel="2"
      ui="s"
    />
  </section>
  <section>
    <h2>日期范围多选</h2>
    <veui-calendar
      v-model="multipleDateRange"
      type="date"
      range
      multiple
    />
  </section>

  <section>
    <h2>月份单选</h2>
    <veui-calendar
      v-model="singleMonth"
      type="month"
      :disabled-date="isYearDisabled"
    />
    Selected:
    {{
      selected5
        ? `${selected5.getFullYear()}-${selected5.getMonth() + 1}`
        : "-"
    }}
  </section>
  <section>
    <h2>月份多选</h2>
    <veui-calendar
      v-model="multipleMonth"
      type="month"
      multiple
    />
  </section>
  <section>
    <h2>月份范围单选(small)</h2>
    <veui-calendar
      v-model="singleMonthRange"
      type="month"
      range
      ui="s"
    />
  </section>
  <section>
    <h2>月份范围多选</h2>
    <veui-calendar
      v-model="multipleMonthRange"
      type="month"
      range
      multiple
    />
  </section>

  <section>
    <h2>年份单选</h2>
    <veui-calendar
      v-model="singleYear"
      :disabled-date="isYearDisabled"
      type="year"
    />
  </section>
  <section>
    <h2>年份多选</h2>
    <veui-calendar
      v-model="multipleYear"
      type="year"
      multiple
    />
  </section>
  <section>
    <h2>年份范围单选(small)</h2>
    <veui-calendar
      v-model="singleYearRange"
      type="year"
      range
      ui="s"
    />
  </section>
  <section>
    <h2>年份范围多选</h2>
    <veui-calendar
      v-model="multipleYearRange"
      type="year"
      range
      multiple
    />
  </section>
  <section>
    <h2>禁用</h2>
    <veui-calendar
      v-model="selected1"
      disabled
    />
  </section>
  <section>
    <h2>多单日选择 <small>(<code>multiple</code>)</small></h2>
    <veui-calendar
      v-model="selected0"
      multiple
      :date-class="dateClass"
    />
  </section>
  <section>
    <h2>时间段选择 <small>(<code>range</code>)</small></h2>
    <veui-calendar
      v-model="selected2"
      range
      :panel="2"
      :disabled-date="isDisabled"
    />
  </section>
  <section>
    <h2>
      多时间段选择带 scoped slot
      <small>(<code>multiple</code> &amp; <code>range</code>)</small>
    </h2>
    <veui-calendar
      v-model="selected3"
      range
      multiple
      :panel="3"
    >
      <template
        slot="date"
        slot-scope="day"
      >
        {{ day.date }}
        <span
          v-if="day.date % 7 === 0"
          style="position: absolute;"
        >
          *
        </span>
      </template>
    </veui-calendar>
  </section>
  <section>
    <h2>外部设置 <code>selected</code></h2>
    <veui-calendar
      v-model="selected4"
      range
      :panel="2"
    />
    <veui-button @click="setSelected">
      设置
    </veui-button>
  </section>
  <section>
    <h2>年份选择</h2>
    <veui-calendar
      v-model="selected6"
      type="year"
    />
    Selected: {{ selected6 ? selected6.getFullYear() : "-" }}
  </section>
</article>
</template>

<script>
import { Calendar, Button } from 'veui'

export default {
  name: 'calendar-demo',
  components: {
    'veui-calendar': Calendar,
    'veui-button': Button
  },
  data () {
    let today = new Date()
    return {
      singleDate: null,
      singleDateRange: [new Date(2019, 9, 10), new Date(2019, 11, 10)],
      multipleDate: null,
      multipleDateRange: null,
      singleMonth: null,
      singleMonthRange: null,
      multipleMonth: null,
      multipleMonthRange: null,
      singleYear: null,
      singleYearRange: null,
      multipleYear: null,
      multipleYearRange: null,
      selected0: null,
      selected1: new Date(1987, 6, 11),
      selected2: [
        today,
        new Date(today.getFullYear(), today.getMonth() + 1, 13)
      ],
      selected3: [
        [new Date(2017, 3, 12), new Date(2017, 3, 18)],
        [new Date(2017, 3, 22), new Date(2017, 3, 24)]
      ],
      selected4: [new Date(2016, 11, 19), new Date(2016, 11, 25)],
      selected5: new Date(2019, 0, 1),
      selected6: new Date(2019, 0, 1),
      isDisabled (day) {
        return !(day.getDate() % 5) || day.getDate() === 1
      },
      isYearDisabled (day) {
        return day.getFullYear() === 2018
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
  },
  methods: {
    setSelected () {
      this.selected4 = [new Date(2016, 11, 19), new Date(2016, 11, 25)]
    }
  }
}
</script>

<style lang="less">
@import "~veui-theme-dls/lib.less";

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
