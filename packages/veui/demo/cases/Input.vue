<template>
  <article class="input-demo">
    <h1><code>&lt;veui-input&gt;</code></h1>
    <veui-form>
      <section class="five-sizes">
        <h3>5 种大小：</h3>
        <veui-field ui="micro" label="micro">
          <veui-input ui="micro" v-model="poem"></veui-input>
        </veui-field>
        <veui-field ui="tiny" label="tiny">
          <veui-input ui="tiny" v-model="poem"></veui-input>
        </veui-field>
        <veui-field ui="small" label="small">
          <veui-input ui="small" v-model="poem"></veui-input>
        </veui-field>
        <veui-field label="normal">
          <veui-input v-model="poem"></veui-input>
        </veui-field>
        <veui-field ui="large" label="large">
          <veui-input ui="large" v-model="poem"></veui-input>
        </veui-field>
      </section>

      <section>
        <h3>事件及功能展示</h3>
        <veui-field label="描述：">
            <veui-input v-model="key" composition @change="log('change')"></veui-input>
            <veui-input v-model="key" compositionn readonly></veui-input>
            <veui-input compositionn v-model="key" :disabled="true"></veui-input>
        </veui-field>

        <veui-field label="姓名：">
            <veui-input v-model="name" @focus="log('focus')"></veui-input>
            <veui-input v-model="name" readonly></veui-input>
            <veui-input v-model="name" disabled></veui-input>
        </veui-field>

        <veui-field label="手机：">
            <veui-input v-model="phone" select-on-focus @blur="log('blur')"></veui-input>
            <veui-input v-model="phone" readonly></veui-input>
            <veui-input v-model="phone" disabled></veui-input>
        </veui-field>

        <veui-field label="密码：">
            <veui-input v-model="password" type="password" autofocus placeholder="请输入密码" @click="log('click')"></veui-input>
            <veui-input v-model="password" type="password" placeholder="请输入密码" readonly></veui-input>
            <veui-input v-model="password" type="password" placeholder="请输入密码" disabled></veui-input>
        </veui-field>

        <veui-field label="隐藏：">
            <veui-span>这里有一个隐藏的&nbsp;input</veui-span><veui-input v-model="hiddenValue" type="hidden"></veui-input>
        </veui-field>
      </section>

      <section>
        <h3>方向键操作</h3>
        <veui-field label="宽度：">
            <veui-input v-nudge.y="{
              smallStep: 0,
              update: handleThumbNudgeUpdate
            }" v-model="width" @focus="log('focus')"></veui-input>
            <veui-input v-model="width" readonly></veui-input>
            <veui-input v-model="width" disabled></veui-input>
        </veui-field>
      </section>

      <section>
        <h3>Textarea 模式 （@Deprecated 请移步 <a href="#/textarea">Veui-Textarea</a>）</h3>
        <veui-field label="多行：">
            <veui-input class="auto-height" type="textarea" v-model="textarea1" rows=5 @input="log"/>
            <veui-input class="fixed-height" type="textarea" v-model="textarea2" readonly/>
            <veui-input type="textarea" v-model="textarea3" disabled/>
        </veui-field>
      </section>
    </veui-form>
  </article>
</template>

<script>
import bus from '../bus'
import { Input, Field, Form, Span } from 'veui'
import nudge from 'veui/directives/nudge'

export default {
  name: 'text-input',
  components: {
    'veui-input': Input,
    'veui-field': Field,
    'veui-form': Form,
    'veui-span': Span
  },
  directives: {
    nudge
  },
  data () {
    return {
      key: '默认忽略输入法，此处不忽略',
      age: null,
      name: '李云腾',
      phone: '13800138000',
      password: null,
      hiddenValue: '隐藏值',
      textarea1: '1. 使用rows\n2. 固定5行高度\n3. 不包括padding',
      textarea2: '设置高度',
      textarea3: '默认高度',
      poem: '兩岸猿聲啼不住，輕舟已過萬重山',
      width: '1024px'
    }
  },
  methods: {
    log (item) {
      bus.$emit('log', item)
    },
    handleThumbNudgeUpdate (delta) {
      let val = this.width

      let digits
      let unit
      if (typeof val === 'string') {
        let matched = val.match(/^(\d+(?:\.\d+)?)(.*)$/)
        if (!matched) {
          return
        }
        [digits, unit] = matched.slice(1)
        digits = parseFloat(digits)
        if (isNaN(digits)) {
          return
        }
      } else if (typeof val === 'number') {
        digits = val
      } else {
        return
      }

      delta = Math.ceil(Math.abs(delta)) * Math.sign(delta)

      // 因为加 0.1 所以处理一下，否则会出现 0.30000000000000004
      let newVal = Math.round((digits + delta) * 10) / 10
      if (unit !== undefined) {
        newVal += unit
      }

      this.width = newVal
    }
  }
}
</script>

<style lang="less">
@import "~less-plugin-est/src/all.less";

.input-demo {
  section {
    margin-bottom: 40px;
  }

  .veui-form {
    .veui-field {
      margin-bottom: 5px;

      & > .veui-form-label {
        width: 50px;
      }
    }
  }

  .veui-input,
  .veui-textarea {
    width: 280px;
  }

  .veui-textarea {
    vertical-align: top;

    &.auto-height {
      height: auto;
    }

    &.fixed-height {
      height: 200px;
    }
  }

  .five-sizes {
    .veui-form-label {
      text-transform: capitalize;
      display: inline-block;
      width: 60px;
      color: #999;
    }
  }
}
</style>
