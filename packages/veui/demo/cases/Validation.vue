<template>
<article class="veui-form-demo">
  <h1>
    form validation
  </h1>
  <section>
    <h2>使用 field 来支持表单验证，使用 name 来定位验证提示</h2>
    <h2>简单规则校验, 输入触发校验</h2>
    <veui-form :data="storeData4">
      <veui-field
        field="name"
        name="name"
        label="姓名"
        :rules="[{ name: 'required', triggers: 'input' }]"
      >
        <veui-input v-model="storeData4.name"/>
      </veui-field>
    </veui-form>

    <h2>复合字段校验, 输入触发校验, 各自展示错误信息</h2>
    <veui-form :data="storeData4">
      <veui-fieldset
        name="phoneSet"
        label="电话"
        required
      >
        <veui-field
          field="phoneType"
          name="phoneType"
          :rules="[{ name: 'required', triggers: 'change,blur' }]"
        >
          <veui-select
            v-model="storeData4.phoneType"
            clearable
            :options="phoneTypeOptions"
          />
        </veui-field>

        <veui-field
          style="margin-left: 4px;"
          field="phone"
          name="phone"
          :rules="numRequiredRule"
        >
          <veui-input v-model="storeData4.phone"/>
        </veui-field>
      </veui-fieldset>
    </veui-form>

    <h2>复合字段校验, 输入触发校验, 集中展示错误信息</h2>
    <veui-form :data="storeData4">
      <veui-fieldset
        name="phoneSet"
        label="电话"
        required
      >
        <veui-field
          field="phoneType"
          name="phoneType"
          :rules="[{ name: 'required', triggers: 'change,blur' }]"
          display-error="bubble"
        >
          <veui-select
            v-model="storeData4.phoneType"
            clearable
            :options="phoneTypeOptions"
          />
        </veui-field>

        <veui-field
          style="margin-left: 4px;"
          field="phone"
          name="phone"
          :rules="numRequiredRule"
          display-error="bubble"
        >
          <veui-input v-model="storeData4.phone"/>
        </veui-field>
      </veui-fieldset>
    </veui-form>

    <h2>垂直排列, 输入触发校验, 集中展示错误信息</h2>
    <veui-form :data="storeData4">
      <veui-fieldset
        name="phoneSet"
        label="电话"
        vertical
        required
      >
        <veui-field
          field="phoneType"
          name="phoneType"
          :rules="[{ name: 'required', triggers: 'change,blur' }]"
          display-error="bubble"
        >
          <veui-select
            v-model="storeData4.phoneType"
            clearable
            :options="phoneTypeOptions"
          />
        </veui-field>

        <veui-field
          field="phone"
          name="phone"
          :rules="numRequiredRule"
          display-error="bubble"
        >
          <veui-input v-model="storeData4.phone"/>
        </veui-field>
      </veui-fieldset>
    </veui-form>

    <h2>
      复杂字段, 用 abstract field 直接调用校验逻辑，错误展示到上层 `Field` 中
    </h2>
    <veui-form :data="storeData2">
      <veui-field
        field="stores"
        name="stores"
        label="门店"
        :rules="[{ name: 'required', triggers: 'input' }]"
        display-error="verbose"
      >
        <veui-transfer
          v-model="storeData2.stores"
          class="store-transfer"
          :datasource="storeOptions"
          @select="handleStoreSelect"
        >
          <template #selected-item-label="{ label, value }">
            <div class="store-label">
              {{ label }}
              <veui-field
                :key="`storeCounts.${value}.0`"
                :name="`storeCounts.${value}.0`"
                :rules="[
                  { name: 'required', message: `请在'${label}'填写第一数量` }
                ]"
                abstract
              >
                <veui-number-input
                  v-model="storeData2.storeCounts[value][0]"
                  class="store-number"
                  ui="s"
                />
              </veui-field>
              <veui-field
                :key="`storeCounts.${value}.1`"
                :name="`storeCounts.${value}.1`"
                :rules="[
                  { name: 'required', message: `请在'${label}'填写第二数量` }
                ]"
                abstract
              >
                <veui-number-input
                  v-model="storeData2.storeCounts[value][1]"
                  class="store-number"
                  ui="s"
                />
              </veui-field>
            </div>
          </template>
        </veui-transfer>
      </veui-field>
      <template slot="actions">
        <veui-button
          ui="primary"
          :loading="isValidating"
          type="submit"
        >提交</veui-button>
      </template>
    </veui-form>

    <h2>联合校验，下限必须小于上限</h2>
    <veui-form
      :data="storeData4"
      :validators="validators"
    >
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
        <veui-span style="margin: 0 4px;">-</veui-span>
        <veui-field
          field="end"
          name="end"
          :rules="numRequiredRule"
        >
          <veui-input v-model="storeData4.end"/>
        </veui-field>
        <veui-span>万</veui-span>
      </veui-fieldset>
      <template slot="actions">
        <veui-button
          ui="primary"
          :loading="isValidating"
          type="submit"
        >提交</veui-button>
      </template>
    </veui-form>

    <h2>校验原生与自定义组件</h2>
    <veui-form
      :data="storeData4"
      :validators="validators2"
    >
      <veui-field
        label="原生input"
        field="input"
        name="input"
        withhold-validity
        :rules="[{ name: 'required', value: true, triggers: 'input' }]"
      >
        <template #default="{ listeners, disabled, readonly, invalid }">
          <input
            v-model="storeData4.input"
            :disabled="disabled"
            :readonly="readonly"
            :class="{
              'demo-field-error': invalid
            }"
            type="text"
            v-on="listeners"
          >
        </template>
      </veui-field>
      <veui-field
        #default="{ listeners, invalid }"
        label="内联复合字段"
        field="complexPhone"
        name="complexPhone"
        :rules="[{ name: 'required', triggers: 'input' }]"
        withhold-validity
      >
        <veui-select
          v-model="storeData4.complexPhone.type"
          :options="phoneTypeOptions"
        />
        <veui-input
          v-model="storeData4.complexPhone.phone"
          :class="{
            'demo-field-error': invalid
          }"
          v-on="listeners"
        />
      </veui-field>
      <template slot="actions">
        <veui-button
          ui="primary"
          :loading="isValidating"
          type="submit"
        >提交</veui-button>
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
  Transfer,
  NumberInput
} from 'veui'
import bus from '../bus'

// const PhoneComponent = {
//   name: 'phone-component',
//   props: {
//     value: Object,
//     options: Array,
//     inputProps: Object
//   },
//   methods: {
//     updatePhone (val) {
//       const newVal = {
//         type: this.value.type,
//         phone: val
//       }
//       this.$emit('input', newVal)
//     },
//     updateType (val) {
//       this.$emit('input', {
//         type: val,
//         phone: ''
//       })
//     }
//   },
//   render () {
//     const { disabled, readonly, isInvalid, listeners } = this.inputProps
//     return (
//       <div>
//         <Select
//           readonly={!!readonly}
//           disabled={!!disabled}
//           options={this.options}
//           value={this.value.type}
//           onChange={this.updateType}
//         />
//         <Input
//           readonly={!!readonly}
//           disabled={!!disabled}
//           onInput={listeners.input}
//           value={this.value.phone}
//           onInput={this.updatePhone}
//           class={{
//             'demo-field-error': isInvalid
//           }}
//         />
//       </div>
//     )
//   }
// }

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
    'veui-transfer': Transfer
    // 'custom-phone': PhoneComponent
  },

  data () {
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
      phoneTypeOptions,
      storeOptions: [
        { label: '春日路门店', value: 1 },
        { label: '夏月路门店', value: 2 },
        { label: '秋星路门店', value: 3 },
        { label: '冬辰路门店', value: 4 }
      ],
      storeData2: {
        stores: [],
        storeCounts: {}
      },
      storeData4: {
        name: 'liyunteng1',
        name1: 'liyunteng2',
        input: '',
        phone: '18888888888',
        phoneType: null,
        start: null,
        end: null,
        complexPhone: {
          type: 'phone',
          phone: ''
        }
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
      isValidating: false,
      validators2: [
        {
          fields: ['complexPhone'],
          handler (complexPhone) {
            if (complexPhone && !complexPhone.phone) {
              return { complexPhone: 'phone is required' }
            }
          },
          triggers: ['input']
        }
      ],
      validators: [
        {
          fields: ['start', 'end'],
          handler (start, end) {
            if (start == null || end == null) {
              return true
            }

            if (parseInt(start, 10) >= parseInt(end, 10)) {
              return {
                end: '上限必须大于下限'
              }
            }
            return true
          },
          triggers: ['change', 'submit,input']
        }
      ]
    }
  },
  methods: {
    handleStoreSelect (val) {
      val = val || []
      let counts = this.storeData2.storeCounts
      val.forEach(id => {
        if (!counts[id]) {
          this.$set(counts, id, [])
        }
      })
      Object.keys(counts).forEach(id => {
        if (val.indexOf(+id) === -1) {
          this.$delete(counts, id)
        }
      })
    },
    handleInvalid (e) {
      this.isValidating = false
    },
    submit (data, e) {
      bus.$emit('log', 'submit', data, e)
    }
  }
}
</script>

<style lang="less">
@import "~veui-theme-dls/lib.less";

.veui-form-demo {
  h2 {
    margin-bottom: 40px;
  }

  section + section {
    margin-top: 50px;
  }

  margin-bottom: 50px;

  .store-label {
    display: flex;
    align-items: center;

    .store-number {
      margin-left: 8px;
    }
  }

  .salary {
    .veui-input {
      width: 67px;
    }
  }

  // 示例
  .store-transfer {
    .veui-filter-panel {
      width: 360px;
    }
  }
}

.demo-field-error {
  border: 1px solid red;
}
</style>
