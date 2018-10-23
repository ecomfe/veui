<template>
  <article>
    <h1><code>&lt;veui-schedule&gt;</code></h1>
    <section>
      <veui-schedule v-model="selected" :hourClass="hourClass"
        :shortcuts="shortcuts" shortcuts-display="popup"></veui-schedule>
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
      },
      hourClass (day, hour) {
        return {
          night: hour > 19,
          weekend: day === 6 || day === 0
        }
      },
      shortcuts: [
        {
          label: '全周',
          selected: {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true
          }
        },
        {
          label: '工组日',
          selected: {
            1: true,
            2: true,
            3: true,
            4: true,
            5: true
          }
        },
        {
          label: '周末',
          selected: {
            0: true,
            6: true
          }
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.veui-schedule {
  & /deep/ .night:not(.veui-schedule-selected) {
   color: #f1f8ff;
  }

  & /deep/ .weekend:not(.veui-schedule-selected) {
    color: #f1fff8;
  }

  & /deep/ .veui-schedule-legend-weekend::before {
    border: 1px solid #dbdbdb;
    background-color: #f1fff8;
  }
}
</style>
