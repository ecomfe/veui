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

    </section>
  </article>
</template>

<script>
import bus from '../bus'
import { Input } from 'veui'

export default {
  name: 'text-input',
  components: {
    'veui-input': Input
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
      textarea3: '默认高度'
    }
  },
  methods: {
    log (item) {
      bus.$emit('log', item)
    }
  }
}
</script>

<style lang="less">
@import "~veui-theme-dux/lib.less";

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
</style>
