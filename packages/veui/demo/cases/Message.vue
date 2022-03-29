<template>
<article class="demo-message">
  <h1><code>&lt;veui-message&gt;</code></h1>
  <section>
    <div class="control-wrapper">
      <veui-radio-button-group
        v-model="ui"
        :items="uiValues"
      />

      <veui-radio-button-group
        v-model="display"
        :items="displayValues"
      />
    </div>
    <div
      v-for="(status, index) in statuses"
      :key="index"
    >
      <span class="message-label">{{ status }}:</span>
      <veui-message
        :display="display"
        :ui="ui"
        :status="status"
      >消息</veui-message>
    </div>
  </section>
</article>
</template>
<script>
import { Message, RadioButtonGroup } from 'veui'

export default {
  name: 'message-demo',
  components: {
    'veui-message': Message,
    'veui-radio-button-group': RadioButtonGroup
  },
  data () {
    return {
      ui: 'm',
      uiValues: [
        { label: 's', value: 's' },
        { label: 'm', value: 'm' }
      ],
      statuses: ['success', 'error', 'info', 'warning', 'aux'],
      display: 'normal',
      displayValues: [
        { label: 'normal', value: 'normal' },
        { label: 'popup', value: 'popup' },
        { label: 'simple', value: 'simple' },
        { label: 'standalone', value: 'standalone' }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 10px;

  & > div {
    display: flex;
    height: 32px;
    align-items: center;
  }

  .message-label {
    min-width: 120px;
  }
}

.veui-radio-button-group {
  & + & {
    margin-left: 24px;
  }
}
</style>
