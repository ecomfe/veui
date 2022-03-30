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
        disabled
        field="name"
        name="name1"
        label="姓名"
        tip="disabled 值提交时会过滤"
      >
        <veui-input v-model="storeData4.name"/>
      </veui-field>

      <veui-field
        field="name1"
        name="name2"
        label="姓名1"
        tip="在 field 上边 disabled，提交时才会过滤掉，该项在 input 上 disalbed"
      >
        <veui-input
          v-model="storeData4.name1"
          disabled
          placeholder="长度不能短于2"
        />
      </veui-field>

      <veui-field
        field="name3"
        name="name3"
        label="别名"
        tip="有内置错误"
        help="辅助文案"
      >
        <veui-input
          v-model="storeData4.name3"
          maxlength="4"
          placeholder="长度不能大于4"
        />
      </veui-field>

      <veui-field
        field="age"
        name="age1"
        :rules="ageRule"
        label="年龄"
        help-position="bottom"
      >
        <veui-input
          v-model="storeData4.age"
          placeholder="错误提示优先出在右侧, 长度不能超过3"
        />
        <template #help>
          <p class="age-help">辅助文案插槽1</p>
          <p>辅助文案插槽2</p>
        </template>
      </veui-field>

      <veui-field
        name="desc"
        rules="required"
        label="介绍"
      >
        <veui-textarea
          v-model="storeData4.desc"
          rows="3"
        />
      </veui-field>

      <veui-fieldset
        name="phoneSet"
        label="电话"
        :required="true"
        help="辅助文案"
        help-position="bottom"
      >
        <veui-field
          field="phoneType"
          name="phoneType"
        >
          <veui-select
            v-model="storeData4.phoneType"
            :options="storeData4Options.phoneTypeOptions"
          />
        </veui-field>

        <veui-field
          style="margin-left: 4px"
          field="phone"
          name="phone"
          :rules="numRequiredRule"
        >
          <veui-input v-model="storeData4.phone"/>
        </veui-field>
        <veui-input placeholder="不会继承 fieldset 的 invalid"/>
      </veui-fieldset>

      <veui-field
        name="phoneSet2"
        label="电话2"
        :required="true"
        help="辅助文案"
        help-position="bottom"
      >
        <veui-field
          field="phoneType2"
          name="phoneType2"
          abstract
        >
          <veui-select
            v-model="storeData4.phoneType2"
            :options="storeData4Options.phoneTypeOptions"
          />
        </veui-field>

        <veui-field
          style="margin-left: 4px"
          field="phone2"
          name="phone2"
          :rules="numRequiredRule"
          abstract
        >
          <veui-input v-model="storeData4.phone2"/>
        </veui-field>
        <veui-input placeholder="不会继承 field 的 invalid"/>
      </veui-field>

      <veui-field
        field="hobby"
        name="hobby"
        :rules="hobbyRule"
        label="爱好"
        tip="选择则至少选三个"
      >
        <veui-checkboxgroup
          v-model="storeData4.hobby"
          type="checkbox"
          :items="storeData4Options.hobbyItems"
        />
      </veui-field>

      <veui-fieldset
        label="预期收入"
        class="salary"
        tip="联合校验，下限必须小于上限"
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
  Textarea,
  Checkbox,
  CheckboxGroup,
  NumberInput,
  Transfer,
  ConfigProvider
} from 'veui'
import bus from '../bus'
import 'vue-awesome/icons/indent'

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
    'veui-textarea': Textarea,
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
        name: 'liyunteng1',
        name1: 'liyunteng2',
        name3: '',
        age: null,
        desc: '',
        hobby,
        phone: '18888888888',
        phoneType,
        phone2: '18888888888',
        phoneType2: phoneType,
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
      dynamicNameRule: [
        {
          name: 'required',
          value: true,
          triggers: 'blur,input'
        },
        {
          name: 'minLength',
          value: 2
        }
      ],
      ageRule: [
        {
          name: 'required',
          message: 'required from rule.',
          value: true,
          triggers: 'blur'
        },
        {
          name: 'numeric',
          value: true,
          triggers: 'input'
        },
        {
          name: 'maxLength',
          value: 3,
          triggers: 'change'
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

            if (parseInt(start, 10) >= parseInt(end, 10)) {
              return {
                start: '下限必须小于上限'
              }
            }
            return true
          },
          triggers: ['change', 'submit,input']
        },
        {
          fields: ['phone'],
          validate (phone) {
            return new Promise(function (resolve) {
              setTimeout(function () {
                let res
                if (phone === '18888888888') {
                  res = {
                    phone: ['该手机已被注册', '芭比q了']
                  }
                }
                return resolve(res)
              }, 3000)
            })
          },
          triggers: ['input']
        },
        {
          fields: ['phone2'],
          validate (phone) {
            return new Promise(function (resolve) {
              setTimeout(function () {
                let res
                if (phone === '18888888888') {
                  res = {
                    phone2: ['该手机已被注册', '芭比q了']
                  }
                }
                return resolve(res)
              }, 3000)
            })
          },
          triggers: ['input']
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
                if (floor <= 1000) {
                  res = {
                    floor: {
                      status: 'warning',
                      message: '请提高下限'
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
    },
    afterValidate () {
      bus.$emit('log', 'afterValidate')
      this.isValidating = false
    },
    dynamicDelete (index) {
      this.storeData5.scheduleInfo.splice(index, 1)
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
}
</style>
