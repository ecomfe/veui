<template>
<article>
  <h1>
    <code>&lt;veui-input&gt;</code>
  </h1>

  <veui-form>
    <section>
      <h3>自动填充适配</h3>
      <veui-input
        class="input"
        placeholder="请输入用户名"
        name="username"
        autocomplete="username"
        clearable
        select-on-focus
        @autofillchange="handleAutofillChange"
      />
      <p>自动填充：{{ autofill }}</p>
    </section>
  </veui-form>

  <veui-form>
    <section>
      <h3>4 种大小：</h3>
      <veui-field ui="xs" label="xs">
        <veui-input v-model="poem" class="input" ui="xs" autofocus/>
      </veui-field>
      <veui-field ui="s" label="s">
        <veui-input v-model="poem" class="input" ui="s"/>
      </veui-field>
      <veui-field ui="s" label="m">
        <veui-input v-model="poem" class="input" ui="m"/>
      </veui-field>
      <veui-field ui="l" label="l">
        <veui-input v-model="poem" class="input" ui="l"/>
      </veui-field>
    </section>

    <section>
      <h3>受控（感知输入法，固定值）</h3>
      <p class="attention">现象：中英文直接不能输入</p>
      <veui-input class="input" value="固定内容" composition ui="xs"/>
      <veui-button ui="xs">Submit</veui-button>
      <h3>受控（不感知输入法，固定值）</h3>
      <p class="attention">
        现象：英文直接不能输入，中文输入法结束时直接被重置
      </p>
      <veui-input class="input" value="固定内容"/>
      <h3>受控（感知输入法, 且用 v-model 同步），value: {{ controlled1 }}</h3>
      <p class="attention">现象：value的值实时在同步</p>
      <veui-input v-model="controlled1" class="input" composition/>
      <veui-button @click="delaySet">delaySet</veui-button>
      <h3>
        受控（不感知输入法, 且用 v-model 同步），value: {{ controlled2 }}
      </h3>
      <p class="attention">
        现象：输入中文时，value的值只有在输入法结束后同步
      </p>
      <veui-input v-model="controlled2" class="input"/>
      <h3>非受控（感知输入法），localValue：{{ uncontrolled1 }}</h3>
      <veui-input class="input" composition @input="uncontrolled1 = $event"/>
      <h3>非受控（不感知输入法），localValue：{{ uncontrolled2 }}</h3>
      <veui-input class="input" @input="uncontrolled2 = $event"/>
    </section>

    <section>
      <h3>事件及功能展示</h3>
      <veui-field label="描述：">
        <veui-input
          v-model="key"
          class="input"
          composition
          placeholder="默认不感知输入法，这里感知"
          @change="log('change')"
        />
        <veui-input
          v-model="key"
          class="input"
          compositionn
          readonly
          placeholder="默认不感知输入法，这里感知"
        />
        <veui-input
          v-model="key"
          class="input"
          compositionn
          :disabled="true"
          placeholder="默认不感知输入法，这里感知"
        />
      </veui-field>

      <veui-field label="姓名：">
        <veui-input
          v-model="name"
          class="input"
          clearable
          placeholder="李云腾"
          @focus="log('focus')"
        />
        <veui-input
          v-model="name"
          class="input"
          readonly
          placeholder="李云腾"
        />
        <veui-input
          v-model="name"
          class="input"
          disabled
          placeholder="李云腾"
        />
      </veui-field>

      <veui-field label="手机：">
        <veui-input
          v-model="phone"
          class="input"
          select-on-focus
          @blur="log('blur')"
        />
        <veui-input v-model="phone" class="input" readonly/>
        <veui-input v-model="phone" class="input" disabled/>
      </veui-field>

      <veui-field label="密码：">
        <veui-input
          v-model="password"
          class="input"
          type="password"
          placeholder="请输入密码"
          @click="log('click')"
        />
        <veui-input
          v-model="password"
          class="input"
          type="password"
          placeholder="请输入密码"
          readonly
        />
        <veui-input
          v-model="password"
          class="input"
          type="password"
          placeholder="请输入密码"
          disabled
        />
      </veui-field>

      <veui-field label="隐藏：">
        <veui-span>这里有一个隐藏的&nbsp;input</veui-span>
        <veui-input v-model="hiddenValue" class="input" type="hidden"/>
      </veui-field>
    </section>

    <section>
      <h3>Before / After Slot</h3>
      <section>
        <veui-input class="input" clearable>
          <template #before>
            <veui-icon name="info-circle"/>
          </template>
        </veui-input>
      </section>
    </section>

    <section>
      <h3>Placeholder Slot</h3>
      <section>
        <veui-input class="input" clearable>
          <template #placeholder>
            <veui-icon name="edit"/>
          </template>
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
          class="input input-nudge"
          clearable
          @focus="log('focus')"
        />
        <veui-input
          v-model="price"
          class="input input-nudge"
          clearable
          readonly
        />
        <veui-input v-model="price" class="input input-nudge" disabled/>
      </veui-field>
    </section>

    <section>
      <h3>value + prop</h3>
      <veui-field label="价格：">
        <veui-input
          class="input"
          :value="price"
          placeholder="??????"
          @change="handlePriceChange"
        />
      </veui-field>
    </section>

    <section>
      <h3>内联样式</h3>
      <veui-field label="内联：">
        <veui-input v-model="price" class="input" ui="inline"/>
        <veui-input v-model="price" class="input" ui="inline" readonly/>
        <veui-input v-model="price" class="input" ui="inline" disabled/>
      </veui-field>
    </section>
  </veui-form>

  <section>
    <h3>错误样式</h3>
    <section>
      <veui-input class="input" invalid/>
      <veui-input class="input" ui="inline" invalid/>
    </section>
  </section>

  <section>
    <h3>字数限制显示</h3>
    <section>
      <veui-input
        class="input"
        placeholder="允许溢出"
        maxlength="6"
        clearable
      />
      <veui-input
        class="input"
        placeholder="不允许溢出"
        maxlength="6"
        clearable
        strict
      />
    </section>
  </section>

  <section>
    <h3>移除前后空白</h3>
    <section>
      <veui-input class="input" placeholder="both" trim/>
      <veui-input class="input" placeholder="start" trim="start"/>
      <veui-input class="input" placeholder="end" trim="end"/>
    </section>
  </section>

  <section>
    <h3>Input mask</h3>
    <veui-input
      class="input"
      mask="####-##-##"
      placeholder="YYYY-MM-DD"
      @input="log"
    />
  </section>

  <section>
    <h3>监听文本尺寸</h3>
    <veui-input class="input" @textwidthchange="width = $event"/>
    <p>Width: {{ width }}px</p>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Input, Field, Form, Span, Icon, Button } from 'veui'
import nudge from 'veui/directives/nudge'
import 'veui-theme-dls-icons/info-circle'
import 'veui-theme-dls-icons/edit'

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
      uncontrolled2: '',
      autofill: false,
      width: 0
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
    },
    handleAutofillChange (val) {
      this.autofill = val
    }
  }
}
</script>

<style lang="less" scoped>
@import '~less-plugin-est/src/all.less';

section {
  margin-bottom: 40px;

  .attention {
    color: red;
  }

  .input {
    margin-right: 10px;
  }

  & > & {
    display: flex;
    align-items: center;
  }
}
</style>
