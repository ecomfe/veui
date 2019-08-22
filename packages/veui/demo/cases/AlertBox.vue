<template>
<article class="alert-box-demo">
  <h1><code>&lt;veui-alert-box&gt;</code></h1>
  <p>
    <veui-button @click="alertBoxOpen = true">
      Default
    </veui-button>
    <veui-alert-box
      :open.sync="alertBoxOpen"
      title="创建条目成功"
    >
      恭喜你，您的资料已经提交成功！
    </veui-alert-box>
  </p>

  <p>
    <veui-button @click="alertSuccessBoxOpen = true">
      Success
    </veui-button>
    <veui-alert-box
      :open.sync="alertSuccessBoxOpen"
      type="success"
    >
      <template slot="title">
        创建条目成功
      </template>
      恭喜你，您的资料已经提交成功！
    </veui-alert-box>
  </p>

  <p>
    <veui-button @click="alertWarningBoxOpen = true">
      Warning
    </veui-button>
    <veui-alert-box
      :open.sync="alertWarningBoxOpen"
      type="warning"
      title="提交完毕"
    >
      您提交的数据量较小，请抽空进行补充。
    </veui-alert-box>
  </p>

  <p>
    <veui-button @click="alertInfoBoxOpen = true">
      Info
    </veui-button>
    <veui-alert-box
      :open.sync="alertInfoBoxOpen"
      type="info"
    >
      <template slot="title">
        创建条目提醒
      </template>
      请完善你的资料，保证内容真实。
    </veui-alert-box>
  </p>

  <p>
    <veui-button @click="alertErrorBoxOpen = true">
      Error
    </veui-button>
    <veui-alert-box
      :open.sync="alertErrorBoxOpen"
      type="error"
    >
      <template slot="title">
        创建条目失败
      </template>
      请完善你的资料，保证内容真实。
    </veui-alert-box>
  </p>
</article>
</template>

<script>
import { Button, AlertBox } from 'veui'

export default {
  name: 'alert-box-demo',
  components: {
    'veui-button': Button,
    'veui-alert-box': AlertBox
  },
  data () {
    return {
      alertBoxOpen: false,
      alertSuccessBoxOpen: false,
      alertWarningBoxOpen: false,
      alertInfoBoxOpen: false,
      alertErrorBoxOpen: false
    }
  }
}
</script>
