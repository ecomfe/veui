<template>
<article class="veui-form-demo">
  <h1>
    <code>&lt;veui-form&gt;</code>
  </h1>
  <section>
    <h2>使用 field 来支持表单验证，使用 name 来定位验证提示</h2>
    <veui-form
      ref="form"
      :data="storeData4"
      :validators="validators"
      :before-validate="beforeValidate"
      :after-validate="afterValidate"
      @submit="submit"
      @invalid="handleInvalid"
    >
      <veui-field
        field="name"
        name="name"
        label="姓名"
        :rules="requiredRule"
        tip="rule validator: required"
        help="不支持特殊字符"
      >
        <veui-input v-model="storeData4.name"/>
      </veui-field>

      <veui-field
        field="alias"
        name="alias"
        label="别名"
        tip="有内置错误, 包含 before 将触发前置校验"
        help-position="bottom"
      >
        <veui-input
          v-model="storeData4.alias"
          maxlength="6"
          placeholder="长度不能大于6"
        />
        <template #help>
          <p class="age-help">非必须字段</p>
          <p>可以重复</p>
        </template>
      </veui-field>

      <veui-field
        field="hobby"
        name="hobby"
        :rules="hobbyRule"
        label="爱好"
        tip="rule-validator: 选择则至少选三个"
      >
        <veui-checkboxgroup
          v-model="storeData4.hobby"
          type="checkbox"
          :items="storeData4Options.hobbyItems"
        />
      </veui-field>

      <veui-field
        :key="storeData4.phoneType"
        name="phone"
        label="电话"
        help="请输入日常联系方式"
        help-position="bottom"
        tip="多个输入型组件: 校验名称和 Field 名称一致的输入组件"
        :rules="phoneRule"
      >
        <veui-select
          v-model="storeData4.phoneType"
          class="phone-type"
          :options="storeData4Options.phoneTypeOptions"
          @change="storeData4.phone = ''"
        />

        <veui-input
          v-model="storeData4.phone"
          name="phone"
          autocomplete="off"
        />
      </veui-field>

      <veui-fieldset
        label="预期收入"
        class="salary"
        tip="异步联合校验，下限必须小于上限"
        :required="true"
      >
        <veui-field
          field="start"
          name="start"
          :rules="numRequiredRule"
          class="start-field"
        >
          <veui-input v-model="storeData4.start"/>
        </veui-field>
        <veui-span style="margin: 0 4px">-</veui-span>
        <veui-field
          field="end"
          name="end"
          :rules="numRequiredRule"
        >
          <veui-input v-model="storeData4.end"/>
        </veui-field>
        <veui-span>万</veui-span>
      </veui-fieldset>

      <veui-field
        label="收入下限"
        field="floor"
        name="floor"
        validity-display="normal"
        tip="异步警告：低于 4000 将会得到警告"
        :rules="[
          { name: 'required', value: true },
          { name: 'min', value: 3500, message: '最低收入不小于 3500' }
        ]"
      >
        <veui-number-input v-model="storeData4.floor"/>
      </veui-field>

      <veui-field
        label="门店："
        name="store"
        :rules="[
          {
            name: 'required',
            message: `请选择门店`,
            triggers: 'select'
          }
        ]"
        tip="抽象表单项"
      >
        <veui-transfer
          v-model="storeData4.store"
          :datasource="storeList"
        >
          <template #selected-item-label="{ label, value }">
            <div class="selected-store">
              <span class="store-label">{{ label }}</span>
              <veui-field
                :key="`storeCounts.${value}`"
                :name="`storeCounts.${value}`"
                :rules="[
                  {
                    name: 'required',
                    message: `请填写${label}的数量`,
                    triggers: 'change,blur'
                  }
                ]"
                abstract
              >
                <veui-number-input
                  v-model="storeData4.storeCounts[value]"
                  class="store-number"
                  ui="s"
                  :min="1"
                />
              </veui-field>
            </div>
          </template>
        </veui-transfer>
      </veui-field>

      <veui-field
        label="原生输入框："
        name="nativeInput"
        :rules="[{ name: 'required', triggers: 'input,blur' }]"
      >
        <template #default="{ invalid, listeners }">
          <input
            v-model="storeData4.nativeInput"
            :class="{
              'demo-invalid': invalid
            }"
            v-on="listeners"
          >
        </template>
      </veui-field>

      <veui-config-provider
        :value="{
          'field.validityDisplay': 'normal'
        }"
      >
        <veui-field
          field="protocol"
          name="protocol"
          :rules="protocolRequiredRule"
          label="协议"
          tip="用 field.validityDisplay 来控制"
        >
          <veui-checkbox
            v-model="storeData4.protocol"
            false-value
          >我已阅读并同意工作协议</veui-checkbox>
        </veui-field>
      </veui-config-provider>

      <template #actions="{ validating }">
        <veui-button
          ui="primary"
          :loading="validating"
          type="submit"
        >提交</veui-button>
        <veui-button
          :disabled="validating"
          @click="() => $refs.form2.reset()"
        >重置</veui-button>
      </template>
    </veui-form>
  </section>
</article>
</template>

<script>
import {
  Form,
  Fieldset,
  Field,
  Span,
  Input,
  Button,
  Select,
  Checkbox,
  CheckboxGroup,
  NumberInput,
  Transfer,
  ConfigProvider
} from 'veui'
import confirmManager from 'veui/managers/confirm'
import bus from '../bus'

export default {
  name: 'demo-form',
  components: {
    'veui-span': Span,
    'veui-input': Input,
    'veui-number-input': NumberInput,
    'veui-button': Button,
    'veui-form': Form,
    'veui-fieldset': Fieldset,
    'veui-field': Field,
    'veui-select': Select,
    'veui-checkbox': Checkbox,
    'veui-checkboxgroup': CheckboxGroup,
    'veui-transfer': Transfer,
    'veui-config-provider': ConfigProvider
  },
  data () {
    let hobby = ['🏸']
    let hobbyItems = [
      {
        value: '⚽️',
        label: '足球'
      },
      {
        value: '🏀',
        label: '篮球'
      },
      {
        value: '🏸',
        label: '羽毛球'
      },
      {
        value: '🎾',
        label: '网球'
      }
    ]
    let phoneType = 'mobile'
    let phoneTypeOptions = [
      {
        label: '座机',
        value: 'phone'
      },
      {
        label: '手机',
        value: 'mobile'
      }
    ]
    return {
      storeData4: {
        name: '曹达华',
        alias: '',
        age: null,
        hobby,
        phone: '18888888888',
        phoneType,
        start: null,
        end: null,
        protocol: '',
        floor: 3500,
        store: [],
        storeCounts: {},
        nativeInput: ''
      },
      storeList: [
        { label: '门店1', value: '1' },
        { label: '门店2', value: '2' },
        { label: '门店3', value: '3' },
        { label: '门店4', value: '4' }
      ],
      storeData4Options: {
        hobbyItems,
        phoneTypeOptions
      },
      requiredRule: [
        {
          name: 'required',
          value: true,
          triggers: 'blur,input'
        }
      ],
      numRequiredRule: [
        {
          name: 'numeric',
          value: true,
          triggers: 'blur,input'
        },
        {
          name: 'required',
          value: true,
          triggers: 'blur,input'
        }
      ],
      protocolRequiredRule: [
        {
          name: 'required',
          value: true,
          message: '请勾选阅读协议',
          triggers: 'change'
        }
      ],
      phoneRule: [
        { name: 'required', triggers: 'change,input,blur' },
        {
          name: 'pattern',
          value: /^1\d{10}$/,
          message: '请输入正确的手机号',
          triggers: 'blur'
        }
      ],
      hobbyRule: [
        {
          name: 'minLength',
          value: 3,
          message: '至少选择三个爱好',
          triggers: 'change'
        }
      ],
      isValidating: false,
      validators: [
        {
          fields: ['start', 'end'],
          handler (start, end) {
            if (start == null || end == null) {
              return true
            }

            return new Promise(function (resolve) {
              setTimeout(function () {
                if (parseInt(start, 10) >= parseInt(end, 10)) {
                  return resolve({
                    start: '下限必须小于上限'
                  })
                }
                return resolve(true)
              }, 2000)
            })
          },
          triggers: ['change', 'submit,input']
        },
        {
          fields: ['floor'],
          validate (floor) {
            if (floor == null) {
              return true
            }
            return new Promise(function (resolve) {
              setTimeout(function () {
                let res
                if (floor <= 4000) {
                  res = {
                    floor: {
                      status: 'warning',
                      message: '请提高预期收入下限'
                    }
                  }
                }
                return resolve(res)
              }, 3000)
            })
          },
          triggers: ['change']
        }
      ]
    }
  },

  methods: {
    handleInvalid (e) {
      bus.$emit('log', 'handleInvalid', e)
      this.isValidating = false
    },
    submit (data, e) {
      bus.$emit('log', 'submit', data, e)
    },
    beforeValidate () {
      bus.$emit('log', 'beforeValidate')
      this.isValidating = true
      if (this.storeData4.alias.indexOf('before') >= 0) {
        return new Promise((resolve) => {
          confirmManager
            .warn('您要继续校验吗？', '确认', {
              ok: () => {}
            })
            .then((ok) => {
              resolve(ok)
            })
        })
      }
    },
    afterValidate () {
      bus.$emit('log', 'afterValidate')
      this.isValidating = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~veui-theme-dls/lib.less";

.veui-form-demo {
  margin-bottom: 50px;

  p {
    margin: 0;
  }

  .age-help {
    margin-bottom: 4px;
  }

  h2 {
    margin-bottom: 40px;
  }

  section + section {
    margin-top: 50px;
  }

  .veui-form[ui~="inline"] + .veui-form[ui~="inline"] {
    margin-top: 30px;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .output {
    position: absolute;
    display: inline-block;
    left: 560px;
    line-height: 36px;
    margin: 0 0 0 50px;

    &::before {
      position: absolute;
      left: -80px;
      content: "⇒";
      line-height: 32px;
      font-size: 30px;
      color: #999;
    }
  }

  .two-name {
    .veui-input {
      width: 75px;
    }
  }

  .salary {
    .veui-input {
      width: 67px;
    }
  }

  .start-field {
    .veui-field-error:first-of-type {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80px;
      white-space: nowrap;
    }
  }

  .operation {
    margin-top: 60px;
    margin-left: 120px;

    [class*="veui"] {
      margin-left: 10px;
    }

    [class*="veui"]:first-child {
      margin-left: 0;
    }
  }

  .selected-store {
    display: flex;
    align-items: center;

    .store-label {
      min-width: 60px;
    }
  }

  .demo-invalid {
    border: 1px solid #cc1800;
  }

  .phone-type {
    max-width: 100px;
    margin-right: 8px;
  }
}
</style>
