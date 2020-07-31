<template>
<article>
  <h1><code>&lt;veui-number-input&gt;</code></h1>
  <section>
    <veui-form>
      <veui-field
        label="xs:"
        ui="xs"
      >
        <veui-number-input
          v-model="number"
          ui="xs"
        >
          <template slot="before">
            Value:
          </template>
        </veui-number-input>
      </veui-field>
      <veui-field
        label="s:"
        ui="s"
      >
        <veui-number-input
          v-model="number1"
          ui="s"
          autofocus
          select-on-focus
        />
      </veui-field>
      <veui-field
        label="m:"
      >
        <veui-number-input
          v-model="number2"
        />
      </veui-field>
      <veui-field
        label="DecimalPlace -1 &amp; Step 0.1:"
        tip="不强制要求小数位数，基准值每次加 0.1"
      >
        <veui-number-input
          v-model="number5"
          :decimal-place="-1"
          :step="0.1"
        />
      </veui-field>
      <veui-field
        label="DecimalPlace -1 &amp; Step 0.01:"
        tip="不强制要求小数位数，基准值每次加 0.01"
      >
        <veui-number-input
          v-model="number5"
          :decimal-place="-1"
          :step="0.01"
        />
      </veui-field>
      <veui-field
        label="DecimalPlace 1 &amp; Step 1:"
        tip="保留1位小数，基准值每次加 1"
      >
        <veui-number-input
          v-model="number3"
          :step="1"
          :decimal-place="1"
        />
      </veui-field>
      <veui-field
        label="DecimalPlace 2 &amp; Step 0.1:"
        tip="保留2位小数，基准值每次加 0.1"
      >
        <veui-number-input
          v-model="number3"
          :step="0.1"
          :decimal-place="2"
        />
      </veui-field>
      <veui-field
        label="Step 10:"
        tip="基准值每次加 10"
      >
        <veui-number-input
          v-model="number4"
          :step="10"
        />
      </veui-field>
      <veui-field
        label="[-1, 10]:"
        :rules="[{ name: 'min', value: -1 }]"
        tip="最大值不大于 10，最小值不小于 -1"
      >
        <veui-number-input
          v-model="number6"
          :max="10"
          :min="-1"
        />
      </veui-field>
      <veui-field
        label="[-10, -5]:"
        :rules="[{ name: 'min', value: -10 }]"
        tip="最大值不大于 -5，最小值不小于 -10"
      >
        <veui-number-input
          :max="-5"
          :min="-10"
        />
      </veui-field>
      <veui-field label="Readonly:">
        <veui-number-input
          v-model="number7"
          readonly
        />
      </veui-field>
      <veui-field
        label="Disabled:"
        disabled
      >
        <veui-number-input v-model="number7"/>
      </veui-field>
      <veui-field label="Invalid:">
        <veui-number-input
          v-model="number7"
          invalid
        />
      </veui-field>
      <veui-field label="Strong:">
        <veui-number-input
          v-model="number8"
          ui="strong"
        />
      </veui-field>
      <veui-field label="Strong s:">
        <veui-number-input
          v-model="number8"
          ui="strong s"
        />
      </veui-field>
      <veui-field label="Strong xs:">
        <veui-number-input
          v-model="number8"
          ui="strong xs"
        />
      </veui-field>
      <veui-field label="Strong invalid:">
        <veui-number-input
          v-model="number8"
          ui="strong"
          invalid
        />
      </veui-field>
    </veui-form>
  </section>

  <section class="sdf">
    <h3>单向数据流</h3>
    <veui-form>
      <veui-field label="Price：">
        <veui-number-input
          :value="number7"
          :min="0"
          @change="handlePriceChange"
        />
      </veui-field>
    </veui-form>
  </section>
  <section class="sdf">
    <h3>定制 formatter 和 parser </h3>
    <veui-form>
      <veui-field label="Percentage：">
        <veui-number-input
          :min="0"
          :parser="percentParser"
          :formatter="percentFormatter"
        />
      </veui-field>
    </veui-form>
  </section>
  <section class="sdf">
    <h3>prop error</h3>
    <veui-form>
      <veui-field
        label="value precision"
        tip="保留1位小数, 但是 prop value 初始是 0.01"
      >
        <veui-number-input
          v-model="precisionValue"
          :min="0"
          :decimal-place="1"
        />
      </veui-field>
      <veui-field
        label="range error"
        tip="[1, 10], prop value 初始是 100"
      >
        <veui-number-input
          v-model="rangeValue"
          :min="1"
          :max="10"
          :decimal-place="1"
        />
      </veui-field>
      <veui-field
        label="type error"
        tip="其实可以不考虑 value 非 Number/Null 的情况，毕竟还是要符合类型声明"
      >
        <veui-number-input
          v-model="typeValue"
          :min="0"
          :decimal-place="1"
        />
      </veui-field>
    </veui-form>
  </section>
</article>
</template>

<script>
import { NumberInput, Field, Form } from 'veui'

export default {
  name: 'number-input',
  components: {
    'veui-number-input': NumberInput,
    'veui-field': Field,
    'veui-form': Form
  },
  data () {
    return {
      number: null,
      number1: null,
      number2: null,
      number3: null,
      number4: null,
      number5: null,
      number6: null,
      number7: 1024,
      number8: 2333,
      precisionValue: 0.01,
      typeValue: '1km',
      rangeValue: 100
    }
  },
  methods: {
    handlePriceChange (val) {
      this.number7 = val
    },
    percentParser (val) {
      return val.replace('%', '')
    },
    percentFormatter (_, val) {
      return val + '%'
    }
  }
}
</script>

<style lang="less" scoped>
.veui-form {
  & /deep/ .veui-field-label {
    width: 140px;
  }
}
.sdf {
  margin-top: 60px;
}
</style>
