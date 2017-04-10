<template>
  <article>
    <h1><code>&lt;veui-input&gt;</code></h1>
    <div class="form-block">
      <div class="form-row">
        <div class="form-key">描述：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="key" @change="log('change')" @click="log('click')"></veui-input>
          <veui-input v-model="key" :readonly="true"></veui-input>
          <veui-input ui="large" v-model="key" :disabled="true"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">年龄：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="age" :placeholder="'请输入年龄'" @change="log('change')" @blur="log('blur')"></veui-input>
          <veui-input v-model="age" :readonly="true" :placeholder="'请输入年龄'"></veui-input>
          <veui-input ui="large"  v-model="age" :disabled="true" :placeholder="'请输入年龄'"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">姓名：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="name" @change="log('change')" @focus="log('focus')"></veui-input>
          <veui-input v-model="name" :readonly="true"></veui-input>
          <veui-input ui="large" v-model="name" :disabled="true"></veui-input>
        </div>
      </div>

      <div class="form-row">
        <div class="form-key">手机：</div>
        <div class="form-value">
          <veui-input ui="small" v-model="phone" @change="log('change')" @input="log('input')"></veui-input>
          <veui-input v-model="phone" :readonly="true"></veui-input>
          <veui-input ui="large" v-model="phone" :disabled="true"></veui-input>
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
      key: null,
      age: null,
      name: '李彦宏·马云·马化腾',
      phone: '13800138000'
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
  }
</style>
