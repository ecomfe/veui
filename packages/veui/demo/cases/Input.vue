<template>
<article>
  <h1><code>&lt;veui-input&gt;</code></h1>
  <veui-form>
    <section class="five-sizes">
      <h3>4 种大小：</h3>
      <veui-field
        ui="micro"
        label="xs"
      >
        <veui-input
          v-model="poem"
          ui="xs"
          autofocus
        />
      </veui-field>
      <veui-field
        ui="tiny"
        label="s"
      >
        <veui-input
          v-model="poem"
          ui="s"
        />
      </veui-field>
      <veui-field
        ui="small"
        label="m"
      >
        <veui-input
          v-model="poem"
          ui="m"
        />
      </veui-field>
      <veui-field
        ui="large"
        label="l"
      >
        <veui-input
          v-model="poem"
          ui="l"
        />
      </veui-field>
    </section>

    <section>
      <h3>受控（感知输入法，固定值）</h3>
      <veui-input
        value="固定内容"
        composition
      />
      <h3>受控（不感知输入法，固定值）</h3>
      <veui-input
        value="固定内容"
      />
      <h3>受控（感知输入法, 且用 v-model 同步），value: {{ controlled1 }}</h3>
      <veui-input
        v-model="controlled1"
        composition
      />
      <veui-button @click="delaySet">delaySet</veui-button>
      <h3>受控（不感知输入法, 且用 v-model 同步），value: {{ controlled2 }}</h3>
      <veui-input
        v-model="controlled2"
      />
      <h3>非受控（感知输入法），localValue：{{ uncontrolled1 }}</h3>
      <veui-input
        composition
        @input="uncontrolled1 = $event"
      />
      <h3>非受控（不感知输入法），localValue：{{ uncontrolled2 }}</h3>
      <veui-input
        @input="uncontrolled2 = $event"
      />
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
      <h3>Before / After</h3>
      <section>
        <veui-input clearable>
          <template slot="before"><veui-icon name="info-circle"/></template>
        </veui-input>
      </section>
    </section>

    <section>
      <h3>方向键操作指令 v-nudge</h3>
      <veui-field label="价格：">
        <veui-input
          v-model="price"
          v-nudge.y="{
            update: handleThumbNudgeUpdate
          }"
          clearable
          class="input-nudge"
          @focus="log('focus')"
        />
        <veui-input
          v-model="price"
          class="input-nudge"
          clearable
          readonly
        />
        <veui-input
          v-model="price"
          class="input-nudge"
          disabled
        />
      </veui-field>
    </section>

    <section>
      <h3>value + prop</h3>
      <veui-field label="价格：">
        <veui-input
          :value="price"
          placeholder="??????"
          @change="handlePriceChange"
        />
      </veui-field>
    </section>

    <section>
      <h3>内联样式</h3>
      <veui-field label="内联：">
        <veui-input
          v-model="price"
          ui="inline"
        />
        <veui-input
          v-model="price"
          ui="inline"
          readonly
        />
        <veui-input
          v-model="price"
          ui="inline"
          disabled
        />
      </veui-field>
    </section>
  </veui-form>

  <section>
    <h3>错误样式</h3>
    <section>
      <veui-input invalid/>
      <veui-input
        ui="inline"
        invalid
      />
    </section>
  </section>

  <section>
    <h3>字数限制显示</h3>
    <section>
      <veui-input
        placeholder="允许溢出"
        maxlength="5"
        clearable
      />
      <veui-input
        placeholder="不允许溢出"
        maxlength="5"
        clearable
        strict
      />
    </section>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Input, Field, Form, Span, Icon, Button } from 'veui'
import nudge from 'veui/directives/nudge'
import 'veui-theme-dls-icons/info-circle'

export default {
  name: 'text-input',
  components: {
    'veui-input': Input,
    'veui-field': Field,
    'veui-form': Form,
    'veui-span': Span,
    'veui-button': Button,
    'veui-icon': Icon
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
      price: '1024',
      controlled1: '',
      controlled2: '',
      uncontrolled1: '',
      uncontrolled2: ''
    }
  },
  methods: {
    log (item) {
      bus.$emit('log', item)
    },
    delaySet () {
      setTimeout(() => {
        this.controlled1 = this.controlled2 = '123'
      }, 3000)
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
        ;[digits, unit] = matched.slice(1)
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
    },
    handlePriceChange (val) {
      this.price = val
    }
  }
}
</script>

<style lang="less" scoped>
@import "~less-plugin-est/src/all.less";

section {
  margin-bottom: 40px;

  .veui-input {
    margin-right: 10px;
  }

  & > & {
    display: flex;
    align-items: center;
  }
}

.veui-form {
  & /deep/ .veui-field {
    margin-bottom: 5px;

    & > .veui-form-label {
      width: 50px;
    }
  }
}

.five-sizes {
  & /deep/ .veui-form-label {
    width: 60px;
    color: #999;
  }
}
</style>
