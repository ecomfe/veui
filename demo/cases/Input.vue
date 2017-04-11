<template>
  <article>
    <h1><code>&lt;veui-input&gt;</code></h1>
    <div class="form-block">
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
          <veui-input ui="small" v-model="phone" autoselect @blur="log('blur')"></veui-input>
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
        <div class="form-key">密码：</div>
        <div class="form-value">
          <veui-input type="textarea" @input="log"></veui-input>
          <veui-input type="textarea" readonly></veui-input>
          <veui-input type="textarea" disabled></veui-input>
        </div>
      </div>

    </div>
  </article>
</template>

<script>
import bus from '../bus'
import Input from '@/components/Input'

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
      password: null
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
      margin-right: 10px;
    }
  }
</style>
