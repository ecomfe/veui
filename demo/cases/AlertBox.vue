<template>
  <article class="alert-box-demo">
    <h1><code>&lt;veui-alert-box&gt;</code></h1>
    <p>
      <veui-button ui="primary"
        @click="alertBoxOpen = true">
        open alert box
      </veui-button>
      <veui-alert-box :open.sync="alertBoxOpen">
        <template slot="title">创建条目成功</template>
        恭喜你，您的资料已经提交成功！
      </veui-alert-box>
    </p>

    <p>
      <veui-button ui="primary"
        @click="alertSuccessBoxOpen = true">
        open success alert box
      </veui-button>
      <veui-alert-box :open.sync="alertSuccessBoxOpen" ui="success">
        <template slot="title">创建条目成功</template>
        恭喜你，您的资料已经提交成功！
      </veui-alert-box>
    </p>

    <p>
      <veui-button ui="primary"
        @click="alertInfoBoxOpen = true">
        open info alert box
      </veui-button>
      <veui-alert-box :open.sync="alertInfoBoxOpen" ui="info">
        <template slot="title">创建条目提醒</template>
        请完善你的资料，保证内容真实。
      </veui-alert-box>
    </p>

    <p>
      <veui-button ui="primary"
        @click="alertErrorBoxOpen = true">
        open error alert box
      </veui-button>
      <veui-alert-box :open.sync="alertErrorBoxOpen" ui="error">
        <template slot="title">创建条目失败</template>
        请完善你的资料，保证内容真实。
      </veui-alert-box>
    </p>
  </article>
</template>

<script>
import Button from '@/components/Button'
import AlertBox from '@/components/AlertBox'

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
      alertInfoBoxOpen: false,
      alertErrorBoxOpen: false
    }
  }
}
</script>

<style lang="less">
.alert-box-demo {

}
</style>
