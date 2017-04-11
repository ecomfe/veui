<template>
  <article>
    <h1><code>&lt;veui-input&gt;</code></h1>
    <div class="form-block">
      <div class="form-row">
        <div class="form-key">描述：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="key" :ignorecomposition="false" @change="log('change')"></veui-input>
          <veui-input v-model="key" :ignorecomposition="false" :readonly="true"></veui-input>
          <veui-input ui="large" :ignorecomposition="false" v-model="key" :disabled="true"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">姓名：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="name" @focus="log('focus')"></veui-input>
          <veui-input v-model="name" :readonly="true"></veui-input>
          <veui-input ui="large" v-model="name" :disabled="true"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">手机：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="phone" :autoselect="true" @blur="log('blur')"></veui-input>
          <veui-input v-model="phone" :readonly="true"></veui-input>
          <veui-input ui="large" v-model="phone" :disabled="true"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">密码：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="password" type="password" :autofocus="true" placeholder="请输入密码" @click="log('click')"></veui-input>
          <veui-input v-model="password" type="password" placeholder="请输入密码" :readonly="true"></veui-input>
          <veui-input ui="large" v-model="password" type="password" placeholder="请输入密码" :disabled="true"></veui-input>
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

    .veui-input {
      margin-right: 10px;
    }
  }
</style>
