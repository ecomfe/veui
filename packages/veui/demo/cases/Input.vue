<template>
  <article>
    <h1><code>&lt;veui-input&gt;</code></h1>
    <section class="form-block">
      <div class="form-row">
        <div class="form-key">描述：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="key" composition @change="log('change')"></veui-input>
          <veui-input v-model="key" compositionn readonly></veui-input>
          <veui-input ui="large" compositionn v-model="key" :disabled="true"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">姓名：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="name" @focus="log('focus')"></veui-input>
          <veui-input v-model="name" readonly></veui-input>
          <veui-input ui="large" v-model="name" disabled></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">手机：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="phone" select-on-focus @blur="log('blur')"></veui-input>
          <veui-input v-model="phone" readonly></veui-input>
          <veui-input ui="large" v-model="phone" disabled></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">密码：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="password" type="password" autofocus placeholder="请输入密码" @click="log('click')"></veui-input>
          <veui-input v-model="password" type="password" placeholder="请输入密码" readonly></veui-input>
          <veui-input ui="large" v-model="password" type="password" placeholder="请输入密码" disabled></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">隐藏：</div>
        <div class="form-value">
          <span class="hidden-tips">这里有一个隐藏的&nbsp;input</span><veui-input v-model="hiddenValue" type="hidden"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">多行：</div>
        <div class="form-value">
          <veui-input type="textarea" v-model="textarea1" rows=3 @input="log"></veui-input>
          <veui-input type="textarea" v-model="textarea2" resizable readonly></veui-input>
          <veui-input type="textarea" v-model="textarea3" disabled></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">宽度：</div>
        <div class="form-value">
          <veui-input ui="small" v-nudge.y="{
            smallStep: 0,
            update: handleThumbNudgeUpdage
          }" v-model="width" @focus="log('focus')"></veui-input>
          <veui-input v-model="width" readonly></veui-input>
          <veui-input ui="large" v-model="width" disabled></veui-input>
        </div>
      </div>

      <div class="form-row five-sizes">
        <div class="form-key">5 种大小：</div>
        <div class="form-value">
          <p>
            <label>micro</label>
            <veui-input ui="micro" v-model="poem"></veui-input>
          </p>
          <p>
            <label>tiny</label>
            <veui-input ui="tiny" v-model="poem"></veui-input>
          </p>
          <p>
            <label>small</label>
            <veui-input ui="small" v-model="poem"></veui-input>
          </p>
          <p>
            <label>normal</label>
            <veui-input v-model="poem"></veui-input>
          </p>
          <p>
            <label>large</label>
            <veui-input ui="large" v-model="poem"></veui-input>
          </p>
        </div>
      </div>

    </section>
  </article>
</template>

<script>
import bus from '../bus'
import { Input } from 'veui'
import nudge from 'veui/directives/nudge'

export default {
  name: 'text-input',
  components: {
    'veui-input': Input
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
      textarea1: '1. 使用rows\n2. 固定3行高度\n3. 不包括padding',
      textarea2: '设置高度，同时可缩放',
      textarea3: '默认高度',
      poem: '兩岸猿聲啼不住，輕舟已過萬重山',
      width: '1024px'
    }
  },
  methods: {
    log (item) {
      bus.$emit('log', item)
    },
    handleThumbNudgeUpdage (delta) {
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

.form-row {
  margin-bottom: 10px;
  .clearfix();
}

.form-key {
  line-height: 42px;
  float: left;
}

.form-value {
  float: left;

  .veui-input,
  .veui-textarea {
    width: 280px;
    margin-right: 10px;
  }

  .veui-textarea {
    vertical-align: top;

    &:nth-child(1) {
      height: auto;
    }

    &:nth-child(2) {
      height: 100px;
    }
  }
}

.hidden-tips {
  line-height: 42px;
}

.five-sizes {
  p > label {
    text-transform: capitalize;
    display: inline-block;
    width: 60px;
    color: #999;
  }
}
</style>
