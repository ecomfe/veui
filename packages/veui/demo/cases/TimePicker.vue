<template>
<article>
  <h1><code>&lt;veui-time-picker&gt;</code></h1>
  <section>
    <h2>小尺寸 + 小时</h2>
    <veui-time-picker
      v-model="value0"
      mode="hour"
      ui="s"
      :min="min0"
      :max="max0"
      clearable
    />
    <veui-input
      ui="s"
      :value="value0"
      placeholder="请输入时间，change触发"
      @change="value0 = $event"
    />

    <h2>小尺寸 + 小时 分钟 + 定制 minute option slot</h2>
    <veui-time-picker
      v-model="value1"
      mode="minute"
      ui="s"
    >
      <span
        slot="option"
        slot-scope="{ label, part }"
      >{{
        part === 'minute' ? label + '?' : label
      }}</span>
    </veui-time-picker>
    <veui-input
      ui="s"
      :value="value1"
      placeholder="请输入时间，change触发"
      @change="value1 = $event"
    />

    <h2>中尺寸 + 小时 分钟 秒钟</h2>
    <veui-time-picker
      v-model="value2"
      ui="m"
    />
    <veui-input
      :value="value2"
      placeholder="请输入时间，change触发"
      @change="value2 = $event"
    />
    <h2>范围限制: {{ min3 }} ~ {{ max3 }}</h2>
    <veui-time-picker
      v-model="value3"
      :min="min3"
      :max="max3"
    />
    <h2>范围限制: {{ min4 }} ~ {{ max4 }} + 定制分钟和秒钟为 [0, 30]</h2>
    <veui-time-picker
      v-model="value4"
      :min="min4"
      :max="max4"
      :minutes="[0, 30]"
      :seconds="[0, 30]"
    />
    <h2>非受控组件</h2>
    <veui-time-picker
      :min="min4"
      :max="max4"
      :minutes="[0, 30]"
      :seconds="[0, 30]"
    />
    <h2>disabled</h2>
    <veui-time-picker
      :min="min4"
      :max="max4"
      disabled
    />
    <h2>readonly</h2>
    <veui-time-picker
      :min="min4"
      :max="max4"
      readonly
    />
  </section>
</article>
</template>

<script>
import { TimePicker, Input } from 'veui'
export default {
  name: 'timepicker-demo',
  components: {
    'veui-time-picker': TimePicker,
    'veui-input': Input
  },
  data () {
    return {
      value0: null,
      min0: '1',
      max0: '10',
      value1: null,
      value2: null,
      value3: null,
      min3: '01:50:00',
      max3: '01:55:00',
      value4: null,
      min4: '01:30:50',
      max4: '03:00:01'
    }
  }
}
</script>

<style lang="less" scoped>
.veui-time-picker {
  margin-right: 10px;
}
</style>
