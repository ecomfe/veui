<template>
<article>
  <h1><code>&lt;veui-input&gt;</code></h1>
  <veui-form>
    <section class="five-sizes">
      <h3>5 种大小：</h3>
      <veui-field
        ui="micro"
        label="micro"
      >
        <veui-input
          v-model="poem"
          ui="micro"
        />
      </veui-field>
      <veui-field
        ui="tiny"
        label="tiny"
      >
        <veui-input
          v-model="poem"
          ui="tiny"
        />
      </veui-field>
      <veui-field
        ui="small"
        label="small"
      >
        <veui-input
          v-model="poem"
          ui="small"
        />
      </veui-field>
      <veui-field label="normal">
        <veui-input v-model="poem"/>
      </veui-field>
      <veui-field
        ui="large"
        label="large"
      >
        <veui-input
          v-model="poem"
          ui="large"
        />
      </veui-field>
    </section>

    <section>
      <h3>事件及功能展示</h3>
      <veui-field label="描述：">
        <veui-input
          v-model="key"
          composition
          placeholder="默认不感知输入法，这里感知"
          @change="log('change')"
        />
        <veui-input
          v-model="key"
          compositionn
          readonly
          placeholder="默认不感知输入法，这里感知"
        />
        <veui-input
          v-model="key"
          compositionn
          :disabled="true"
          placeholder="默认不感知输入法，这里感知"
        />
      </veui-field>

      <veui-field label="姓名：">
        <veui-input
          v-model="name"
          clearable
          placeholder="李云腾"
          @focus="log('focus')"
        />
        <veui-input
          v-model="name"
          readonly
          placeholder="李云腾"
        />
        <veui-input
          v-model="name"
          disabled
          placeholder="李云腾"
        />
      </veui-field>

      <veui-field label="手机：">
        <veui-input
          v-model="phone"
          select-on-focus
          @blur="log('blur')"
        />
        <veui-input
          v-model="phone"
          readonly
        />
        <veui-input
          v-model="phone"
          disabled
        />
      </veui-field>

      <veui-field label="密码：">
        <veui-input
          v-model="password"
          type="password"
          autofocus
          placeholder="请输入密码"
          @click="log('click')"
        />
        <veui-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          readonly
        />
        <veui-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          disabled
        />
      </veui-field>

      <veui-field label="隐藏：">
        <veui-span>这里有一个隐藏的&nbsp;input</veui-span><veui-input
          v-model="hiddenValue"
          type="hidden"
        />
      </veui-field>
    </section>

    <section>
      <h3>After Slot / 方向键操作指令 v-nudge </h3>
      <veui-field label="价格：">
        <veui-input
          v-model="price"
          v-nudge.y="{
            update: handleThumbNudgeUpdate
          }"
          clearable
          class="input-nudge"
          @focus="log('focus')"
        >
          <template slot="after">
            元
          </template>
        </veui-input>
        <veui-input
          v-model="price"
          class="input-nudge"
          clearable
          readonly
        >
          <template slot="after">
            元
          </template>
        </veui-input>
        <veui-input
          v-model="price"
          class="input-nudge"
          disabled
        >
          <template slot="after">
            元
          </template>
        </veui-input>
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
      key: null,
      name: null,
      phone: '13800138000',
      password: null,
      hiddenValue: '隐藏值',
      poem: '兩岸猿聲啼不住，輕舟已過萬重山',
      price: '1024'
    }
  },
  methods: {
    log (item) {
      bus.$emit('log', item)
    },
    handleThumbNudgeUpdate (delta) {
      let val = this.price

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

      // 因为加 0.1 所以处理一下，否则会出现 0.30000000000000004
      let newVal = Math.round((digits + delta) * 10) / 10
      if (unit !== undefined) {
        newVal += unit
      }

      this.price = newVal
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less-plugin-est/src/all.less";

section {
  margin-bottom: 40px;
}

.veui-form {
  & /deep/ .veui-field {
    margin-bottom: 5px;

    & > .veui-form-label {
      width: 50px;
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

  /deep/ .veui-input-after {
    padding-right: 5px;
  }
}

.five-sizes {
  & /deep/ .veui-form-label {
    text-transform: capitalize;
    width: 60px;
    color: #999;
  }
}
</style>
