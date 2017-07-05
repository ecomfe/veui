<template>
  <article class="veui-form-demo">
    <h1><code>&lt;veui-form&gt;</code></h1>
    <section>
      <h2>通过指定data、field及v-model来创建一个form</h2>
      <veui-form ref="form1" :data="storeData1">

        <veui-field label="昵称" field="nickName">
          <veui-input v-model="storeData1.nickName"></veui-input>
        </veui-field>

        <veui-field label="性别" field="sex">
          <veui-select :options="storeData1.sexItems" v-model="storeData1.sex"></veui-select>
        </veui-field>

        <veui-field label="婚姻" field="married">
          <veui-radioboxgroup :items="storeData1.marryItems" v-model="storeData1.married"></veui-radioboxgroup>
        </veui-field>

        <veui-field label="爱好" field="habit">
          <veui-checkboxgroup type="checkbox" :items="storeData1.habitItems" v-model="storeData1.habit"></veui-checkboxgroup>
        </veui-field>

        <veui-field label="生日" field="birthday">
          <veui-datepicker v-model="storeData1.birthday"></veui-datepicker>
        </veui-field>

        <veui-field label="头像" field="avatar">
          <veui-uploader uploaderType="image"
            action="/upload"
            request-mode="xhr"
            ui="multiline vertical bottom-mask list-icon"
            :disabled="false"
            :max-count="1"
            :value="storeData1.avatar"
            :max-size="10"
            preview-image
            needButton
            extention-types="jpg,jpeg,png"></veui-uploader>
          <!-- <p class="output">{{ outputData.avatar }}</p> -->
        </veui-field>

        <div class="operation">
          <veui-button @click="() => this.$refs.form1.reset()">重置</veui-button>
        </div>
      </veui-form>
    </section>
    <section>
      <h2>行内多组件表单</h2>
      <veui-form>

        <veui-fieldset class="two-name" label="昵称" label-for="firstName" tip='使用 label-for="refName" 来实现 for'>
          <veui-field>
            <veui-input placeholder="姓" v-model="storeData2.lastName"></veui-input>
          </veui-field>

          <veui-field>
            <veui-input ref="firstName" placeholder="名" v-model="storeData2.firstName"></veui-input>
          </veui-field>
        </veui-fieldset>

        <veui-fieldset label="电话" label-for="telephone">
          <veui-field>
            <veui-select v-model="storeData2.phoneType" :options="storeData2.phoneTypeOptions"></veui-select>
          </veui-field>

          <veui-field>
            <veui-input ref="telephone" placeholder="名" v-model="storeData2.phone"></veui-input>
          </veui-field>
        </veui-fieldset>

        <veui-fieldset label="预期收入" class="salary" tip="使用 <veui-span> 来插入中间非组件内容">
          <veui-field>
            <veui-input v-model="storeData2.start"></veui-input>
          </veui-field>
          <veui-span>-</veui-span>
          <veui-field>
            <veui-input v-model="storeData2.end"></veui-input>
          </veui-field>
          <veui-span>万</veui-span>
        </veui-fieldset>
      </veui-form>
    </section>
    <section>
      <h2>行内表单</h2>
      <veui-form ui="inline">

        <veui-fieldset class="left">
          <veui-field label="状态">
            <veui-select v-model="storeData3.statusSelected" :options="storeData3.statusOptions"></veui-select>
          </veui-field>

          <veui-field label="搜索项目">
            <veui-select v-model="storeData3.searchTypeSelected" :options="storeData3.searchTypeOptions"></veui-select>
          </veui-field>
        </veui-fieldset>

        <veui-fieldset class="right">
          <veui-field>
            <veui-input placeholder="请输入搜索内容"></veui-input>
          </veui-field>
          <veui-button ui="primary">搜索</veui-button>
        </veui-fieldset>

      </veui-form>

      <veui-form ui="inline">

        <veui-fieldset class="left" ui="alt">
          <veui-field label="状态">
            <veui-select ui="alt" v-model="storeData3.statusSelected" :options="storeData3.statusOptions"></veui-select>
          </veui-field>

          <veui-field label="搜索项目">
            <veui-select ui="alt" v-model="storeData3.searchTypeSelected" :options="storeData3.searchTypeOptions"></veui-select>
          </veui-field>
        </veui-fieldset>

        <veui-fieldset class="right">
          <veui-field>
            <veui-input placeholder="请输入搜索内容"></veui-input>
          </veui-field>
          <veui-button ui="primary">搜索</veui-button>
        </veui-fieldset>

      </veui-form>
    </section>
    <section>
      <h2>使用 field 来支持表单验证，使用 name 来定位验证提示</h2>
      <veui-form ref="form2"
        @submit="submit"
        @invalid="handleInvalid"
        :data="storeData4"
        :validators="validators"
        :beforeValidate="beforeValidate"
        :afterValidate="afterValidate">

        <veui-field field="name" name="name1" rules="required" label="姓名" tip="必填，默认提交时校验">
          <veui-input v-model="storeData4.name"></veui-input>
        </veui-field>

        <veui-field field="name" name="name2" :rules="dynamicNameRule" label="姓名（动态）" tip="blur时校验必填">
          <veui-input placeholder="长度不能短于2" v-model="storeData4.name"></veui-input>
        </veui-field>

        <veui-field field="age" name="age1" rules="numeric required" label="年龄">
          <veui-input placeholder="错误提示优先出在右侧" v-model="storeData4.age"></veui-input>
        </veui-field>

        <veui-field field="age" name="age2" :rules="dynamicAgeRule" label="年龄（动态）" tip="change 时校验长度">
          <veui-input placeholder="长度不能超过3" v-model="storeData4.age"></veui-input>
        </veui-field>

        <veui-field field="desc" name="desc" rules="required" label="介绍">
          <veui-input rows="3" type="textarea" v-model="storeData4.desc"></veui-input>
        </veui-field>

        <veui-fieldset name="phoneSet" label="电话" label-for="phone">
          <veui-field field="phoneType" name="phoneType">
            <veui-select v-model="storeData4.phoneType" :options="storeData4.phoneTypeOptions"></veui-select>
          </veui-field>

          <veui-field field="phone" name="phone" rules="numeric required">
            <veui-input ref="phone" v-model="storeData4.phone"></veui-input>
          </veui-field>
        </veui-fieldset>

        <veui-field field="habit" name="habit" :rules="habitRule" label="爱好" tip="至少选择三个">
          <veui-checkboxgroup type="checkbox" :items="storeData4.habitItems" v-model="storeData4.habit"></veui-checkboxgroup>
        </veui-field>

        <veui-fieldset label="预期收入" class="salary" tip="联合校验，下限必须小于上限">
          <veui-field field="start" name="start" rules="numeric required" class="start-field">
            <veui-input v-model="storeData4.start"></veui-input>
          </veui-field>
          <veui-span>-</veui-span>
          <veui-field field="end" name="end" rules="numeric required">
            <veui-input v-model="storeData4.end"></veui-input>
          </veui-field>
          <veui-span>万</veui-span>
        </veui-fieldset>

        <veui-field field="protocol" name="protocol" label="协议">
          <veui-checkbox v-model="storeData4.protocol">同意工作协议</veui-checkbox>
        </veui-field>

        <div class="operation">
          <veui-button ui="primary" ref="submitBtn" :loading="isValidating" type="submit">提交</veui-button>
        </div>
      </veui-form>
    </section>
    <section>
      <h2>动态表单</h2>
      <veui-form
        @submit="submit"
        @invalid="handleInvalid"
        :data="storeData5"
        :validators="qindianValidator"
        :beforeValidate="beforeValidate"
        :afterValidate="afterValidate">

        <veui-field field="qindian" label="负责人" name="qindian">
          <veui-input v-model="storeData5.qindian"></veui-input>
        </veui-field>

        <veui-fieldset v-for="(item, index) in storeData5.scheduleInfo">
          <veui-field
            :field="`scheduleInfo[${index}].project`"
            :name="'projectName' + (index + 1)"
            :rules="requiredRule"
            :label="'项目排期-' + (index + 1)">
            <veui-input placeholder="项目名称" v-model="item.project"></veui-input>
          </veui-field>
          <veui-field
            :field="`scheduleInfo[${index}].range`"
            :name="'schedule' + (index + 1)"
            :rules="requiredRule">
            <veui-datepicker v-model="item.range" range></veui-datepicker>
          </veui-field>
          <veui-button @click="dynamicDelete(index)">删除</veui-button>
        </veui-fieldset>

        <div class="operation">
          <veui-button ui="primary" ref="submitBtn" :loading="isValidating" type="submit">提交</veui-button>
          <veui-button @click="dynamicAdd">新增项目及排期</veui-button>
        </div>
      </veui-form>
    </section>
  </article>
</template>

<script>
import Form from '@/components/Form'
import FieldSet from '@/components/FieldSet'
import Field from '@/components/Field'
import Span from '@/components/Span'
import Input from '@/components/Input'
import Button from '@/components/Button'
import DatePicker from '@/components/DatePicker'
import Uploader from '@/components/Uploader'
import Select from '@/components/Select'
import CheckBox from '@/components/CheckBox'
import CheckBoxGroup from '@/components/CheckBoxGroup'
import RadioBoxGroup from '@/components/RadioBoxGroup'
import moment from 'moment'
import bus from '../bus'

export default {
  name: 'demo-form',

  components: {
    'veui-span': Span,
    'veui-input': Input,
    'veui-button': Button,
    'veui-form': Form,
    'veui-fieldset': FieldSet,
    'veui-field': Field,
    'veui-datepicker': DatePicker,
    'veui-uploader': Uploader,
    'veui-select': Select,
    'veui-checkbox': CheckBox,
    'veui-checkboxgroup': CheckBoxGroup,
    'veui-radioboxgroup': RadioBoxGroup
  },

  data () {
    let habit = ['🏸']
    let habitItems = [
      {
        value: '⚽️', label: '足球'
      },
      {
        value: '🏀', label: '篮球'
      },
      {
        value: '🏸', label: '羽毛球'
      },
      {
        value: '🎾', label: '网球'
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
      storeData1: {
        nickName: '李云腾',
        sex: '女',
        married: false,
        marryItems: [
          {
            value: true, label: '已婚'
          },
          {
            value: false, label: '未婚'
          }
        ],
        sexItems: [
          {
            value: '-', label: '不告诉你'
          },
          {
            value: '男', label: '男'
          },
          {
            value: '女', label: '女'
          }
        ],
        habit,
        habitItems,
        birthday: new Date(),
        avatar: [{ src: 'https://www.baidu.com/img/bd_logo1.png' }]
      },
      storeData2: {
        lastName: '',
        firstName: '',
        habit,
        habitItems,
        phone: '18888888888',
        phoneType,
        phoneTypeOptions,
        start: null,
        end: null
      },
      storeData3: {
        statusSelected: 1,
        statusOptions: [
          {
            label: '状态1',
            value: 1
          },
          {
            label: '状态2',
            value: 2
          },
          {
            label: '状态3',
            value: 3
          },
          {
            label: '状态4',
            value: 4
          }
        ],
        searchTypeSelected: 1,
        searchTypeOptions: [
          {
            label: '项目1',
            value: 1
          },
          {
            label: '项目2',
            value: 2
          },
          {
            label: '项目3',
            value: 3
          },
          {
            label: '项目4',
            value: 4
          }
        ]
      },
      storeData4: {
        name: '',
        age: null,
        desc: '',
        habit,
        habitItems,
        phone: '18888888888',
        phoneType,
        phoneTypeOptions,
        start: null,
        end: null,
        protocol: false
      },
      requiredRule: [
        {
          name: 'required',
          value: true,
          triggers: 'blur,input'
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
      dynamicAgeRule: [
        {
          name: 'numeric',
          value: true
        },
        {
          name: 'maxLength',
          value: 3,
          triggers: 'change'
        }
      ],
      habitRule: [
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
          fields: 'start,end',
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
          fields: 'phone',
          handler (phone) {
            return new Promise(function (resolve, reject) {
              setTimeout(function () {
                if (phone === '18888888888') {
                  return reject({
                    phoneSet: '该手机已被注册'
                  })
                }
                return resolve()
              }, 3000)
            })
          }
        },
        {
          fields: 'protocol',
          handler (protocol) {
            return protocol || {
              protocol: '必须同意协议'
            }
          }
        }
      ],
      beforeValidate () {
        bus.$emit('log', 'beforeValidate')
        this.isValidating = true
      },
      afterValidate () {
        bus.$emit('log', 'afterValidate')
        this.isValidating = false
      },
      storeData5: {
        qindian: 'Evan You',
        scheduleInfo: [
          {
            project: 'vuejs',
            range: [moment().toDate(), moment().add(3, 'month').toDate()]
          }
        ]
      },
      qindianValidator: [
        {
          fields: 'qindian,qindian',
          handler (qindian) {
            if (qindian !== 'Evan You') {
              return {
                qindian: '该项为钦点项，就别改了'
              }
            }
            return true
          },
          triggers: ['input', 'submit']
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
    dynamicAdd () {
      this.storeData5.scheduleInfo.push({
        project: null,
        range: null
      })
    },
    dynamicDelete (index) {
      this.storeData5.scheduleInfo.splice(index, 1)
    }
  }
}
</script>

<style lang="less">
@import "../../src/styles/theme-default/lib.less";

.veui-form-demo {
  h2 {
    margin-bottom: 40px;
  }

  section + section {
    margin-top: 50px;
  }

  margin-bottom: 50px;

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

  .veui-uploader-list-image li {
    margin: 0;
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
}
</style>
