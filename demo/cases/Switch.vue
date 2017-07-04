<template>
  <article>
    <h1><code>&lt;veui-switch&gt;</code></h1>
    <p>
      <veui-switch ui="small" :value="value1"></veui-switch>
      <veui-switch ui="small"></veui-switch>
      <veui-switch :value="value2"></veui-switch>
      <veui-switch :value="value2"></veui-switch>
      <veui-switch ui="large" :value="value3"></veui-switch>
      <veui-switch ui="large" :value="value3"></veui-switch>
    </p>

    <p>
      <veui-switch ui="small" :value="value1"></veui-switch>
      <veui-switch></veui-switch>
    </p>

    <p>
      <veui-switch ui="small" :value="value2" :disabled="disabled"></veui-switch>
      <veui-switch :disabled="disabled"></veui-switch>
      <veui-switch ui="large" :value="value2" :disabled="disabled"></veui-switch>
    </p>

    <p>
      <veui-switch ui="small" state="off" :readonly="readonly"></veui-switch>
      <veui-switch ui="small" state="on" :readonly="readonly"></veui-switch>
      <veui-switch ui="small"state="off" :readonly="readonly"></veui-switch>
      <veui-switch state="on" :readonly="readonly"></veui-switch>
    </p>

    <p>
      <veui-switch ui="small plain" :value="value1"></veui-switch>
      <veui-switch ui="plain" :value="value1"></veui-switch>
      <veui-switch ui="large plain" :value="value1"></veui-switch>
    </p>

    <!-- <p>
      <veui-switch ui="small" state="off" animate="true" disabled="disabled"></veui-switch>
      <veui-switch state="off" animate="true" disabled="disabled"></veui-switch>
      <veui-switch ui="large" state="off" animate="true" disabled="disabled"></veui-switch>
      不可用
    </p>
    <p>
      <veui-switch ui="small" state="on" animate="true" readonly="readonly"></veui-switch>
      <veui-switch ui="small" state="off" animate="true" readonly="readonly"></veui-switch>
      <veui-switch state="on" animate="true" readonly="readonly"></veui-switch>
      <veui-switch state="off" animate="true" readonly="readonly"></veui-switch>
      <veui-switch ui="large" state="on" animate="true" readonly="readonly"></veui-switch>
      <veui-switch ui="large" state="off" animate="true" readonly="readonly"></veui-switch>
      只读
    </p>
    <p>
      <veui-switch ui="small plain" state="on" animate="true" onText="开" offText="关"></veui-switch>
      <veui-switch ui="small plain" state="off" animate="true" onText="开" offText="关"></veui-switch>
      <veui-switch ui="plain" state="on" animate="true" onText="开" offText="关"></veui-switch>
      <veui-switch ui="plain" state="off" animate="true" onText="开" offText="关"></veui-switch>
      <veui-switch ui="large plain" state="on" animate="true" onText="开" offText="关"></veui-switch>
      <veui-switch ui="large plain" state="off" animate="true" onText="开" offText="关"></veui-switch>
      只读
    </p>
    <p style="margin-bottom:100px;">
      <veui-switch ui="small" state="on" error-message="设置错误"></veui-switch>
      <veui-switch ui="small" state="off" error-message="设置错误"></veui-switch>
    </p> -->

  </article>
</template>

<script>
import Switch from '@/components/Switch'

export default {
  name: 'Switch',
  components: {
    'veui-switch': Switch
  },
  data () {
    return {
      readonly: true,
      disabled: true,
      state1: 'on',
      state2: 'off',
      state3: 'on',
      value1: true,
      value2: false,
      value3: true
    }
  },
  destroyed () {
  }
}
</script>

<style>
p {
  user-select: none;
}
</style>
