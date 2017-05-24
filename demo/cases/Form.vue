<template>
  <article class="veui-form-demo">
    <h1><code>&lt;veui-form&gt;</code></h1>
    <section>
      <h2>表单输出数据可与输入分离，做中间转换</h2>
      <veui-form ref="form1" :form-data="outputData">

        <veui-form-row label="昵称">
          <veui-form-value>
            <veui-input name="nickName" v-model="storeData1.nickName"></veui-input>
          </veui-form-value>
          <p class="output">{{ outputData.nickName }}</p>
        </veui-form-row>

        <veui-form-row label="性别">
          <veui-form-value>
            <veui-radioboxgroup type="radiobox" :items="storeData1.sexItems" name="sex" v-model="storeData1.sex"></veui-radioboxgroup>
          </veui-form-value>
          <p class="output">{{ outputData.sex }}</p>
        </veui-form-row>

        <veui-form-row label="爱好">
          <veui-form-value>
            <veui-checkboxgroup type="checkbox" :items="storeData1.habitItems" name="habit" v-model="storeData1.habit"></veui-checkboxgroup>
          </veui-form-value>
          <p class="output">{{ outputData.habit }}</p>
        </veui-form-row>

        <veui-form-row label="生日">
          <veui-form-value>
            <veui-datepicker name="birthday" v-model="storeData1.birthday"></veui-datepicker>
          </veui-form-value>
          <p class="output">{{ outputData.birthday }}</p>
        </veui-form-row>

        <veui-form-row label="头像">
          <veui-form-value>
          <veui-uploader uploaderType="image"
            name="avatar"
            action="/upload"
            request-mode="xhr"
            ui="multiline horizontal bottom-mask list-icon"
            :disabled="false"
            :max-count="1"
            :value="storeData1.avatar"
            :max-size="10"
            preview-image
            needButton
            extention-types="jpg,jpeg,png"></veui-uploader>
          </veui-form-value>
          <p class="output">{{ outputData.avatar }}</p>
        </veui-form-row>

        <veui-form-row>
          <veui-button @click="() => this.$refs.form1.reset()">重置</veui-button>
        </veui-form-row>
      </veui-form>
    </section>
    <section>
      <h2>行内多组件表单</h2>
      <veui-form>

        <veui-form-row class="two-name" label="昵称" label-for="firstName" tip='使用 label-for="refName" 来实现 for'>
          <veui-form-value>
            <veui-input name="lastName" placeholder="姓" v-model="storeData2.lastName"></veui-input>
          </veui-form-value>

          <veui-form-value>
            <veui-input name="firstName" ref="firstName" placeholder="名" v-model="storeData2.firstName"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="电话" label-for="phone">
          <veui-form-value>
            <veui-select name="phoneType" v-model="storeData2.phoneType" :options="storeData2.phoneTypeOptions"></veui-select>
          </veui-form-value>

          <veui-form-value>
            <veui-input name="phone" ref="phone" placeholder="名" v-model="storeData2.phone"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="预期收入" class="salary" tip="使用 .veui-span 来插入中间非组件内容">
          <veui-form-value>
            <veui-input name="start" v-model="storeData2.start"></veui-input>
          </veui-form-value>
          <span class="veui-span">-</span>
          <veui-form-value>
            <veui-input name="end" v-model="storeData2.end"></veui-input>
          </veui-form-value> 万
        </veui-form-row>
      </veui-form>
    </section>
    <section>
      <h2>行内表单</h2>
      <veui-form ui="inline">

        <div class="left">
          <veui-form-row label="状态">
            <veui-form-value>
              <veui-select name="status" v-model="storeData3.statusSelected" :options="storeData3.statusOptions"></veui-select>
            </veui-form-value>
          </veui-form-row>

          <veui-form-row label="搜索项目">
            <veui-form-value>
              <veui-select name="searchType" v-model="storeData3.searchTypeSelected" :options="storeData3.searchTypeOptions"></veui-select>
            </veui-form-value>
          </veui-form-row>
        </div>

        <div class="right">
          <veui-form-row>
            <veui-form-value>
              <veui-input name="searchContent" placeholder="请输入搜索内容"></veui-input>
            </veui-form-value>
          </veui-form-row>
          <veui-form-row>
            <veui-button ui="primary">搜索</veui-button>
          </veui-form-row>
        </div>

      </veui-form>

      <veui-form ui="inline">

        <fieldset class="left">
          <veui-form-row label="状态">
            <veui-form-value>
              <veui-select ui="alt" name="status" v-model="storeData3.statusSelected" :options="storeData3.statusOptions"></veui-select>
            </veui-form-value>
          </veui-form-row>

          <veui-form-row label="搜索项目">
            <veui-form-value>
              <veui-select ui="alt" name="searchType" v-model="storeData3.searchTypeSelected" :options="storeData3.searchTypeOptions"></veui-select>
            </veui-form-value>
          </veui-form-row>
        </fieldset>

        <div class="right">
          <veui-form-row>
            <veui-form-value>
              <veui-input name="searchContent" placeholder="请输入搜索内容"></veui-input>
            </veui-form-value>
          </veui-form-row>
          <veui-form-row>
            <veui-button ui="primary">搜索</veui-button>
          </veui-form-row>
        </div>

      </veui-form>
    </section>
    <section>
      <h2>表单提示和验证</h2>
      <veui-form ref="form2" @submit="submit" @invalid="handleInvalid" :validators="validators" :afterValidate="afterValidate">

        <veui-form-row label="姓名" tip="必填，默认提交时校验">
          <veui-form-value rules="required">
            <veui-input name="name1" v-model="storeData4.name"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="姓名（动态）" tip="blur时校验必填">
          <veui-form-value :rules="dynamicNameRule">
            <veui-input name="name2" placeholder="长度不能短于2" v-model="storeData4.name"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="年龄">
          <veui-form-value rules="numeric required">
            <veui-input name="age1" placeholder="错误提示优先出在右侧" v-model="storeData4.age"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="年龄（动态）" tip="change 时校验长度">
          <veui-form-value :rules="dynamicAgeRule">
            <veui-input name="age2" placeholder="长度不能超过3" v-model="storeData4.age"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="介绍">
          <veui-form-value rules="required">
            <veui-input name="desc" rows="3" type="textarea" v-model="storeData4.desc"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="电话" label-for="phone">
          <veui-form-value>
            <veui-select name="phoneType" v-model="storeData2.phoneType" :options="storeData2.phoneTypeOptions"></veui-select>
          </veui-form-value>

          <veui-form-value rules="numeric required">
            <veui-input name="phone" ref="phone" placeholder="名" v-model="storeData2.phone"></veui-input>
          </veui-form-value>
        </veui-form-row>

        <veui-form-row label="预期收入" class="salary" tip="联合校验，下限必须小于上限">
          <veui-form-value rules="numeric required">
            <veui-input name="start" v-model="storeData2.start"></veui-input>
          </veui-form-value>
          <span class="veui-span">-</span>
          <veui-form-value rules="numeric required">
            <veui-input name="end" v-model="storeData2.end"></veui-input>
          </veui-form-value> 万
        </veui-form-row>

        <veui-form-row>
          <veui-button ui="primary" ref="submitBtn" @click="setLoading" :loading="isValidating" type="submit">提交</veui-button>
        </veui-form-row>
      </veui-form>
    </section>
  </article>
</template>

<script>
import Form from '@/components/Form/Form'
import FormRow from '@/components/Form/Row'
import FormValue from '@/components/Form/Value'
import Input from '@/components/Input'
import Button from '@/components/Button'
import DatePicker from '@/components/DatePicker'
import Uploader from '@/components/Uploader'
import Select from '@/components/Select'
import CheckBoxGroup from '@/components/CheckBoxGroup'
import RadioBoxGroup from '@/components/RadioBoxGroup'
import moment from 'moment'
import bus from '../bus'

export default {
  name: 'form',

  components: {
    'veui-input': Input,
    'veui-button': Button,
    'veui-form': Form,
    'veui-form-row': FormRow,
    'veui-form-value': FormValue,
    'veui-datepicker': DatePicker,
    'veui-uploader': Uploader,
    'veui-select': Select,
    'veui-checkboxgroup': CheckBoxGroup,
    'veui-radioboxgroup': RadioBoxGroup
  },

  data () {
    return {
      storeData1: {
        nickName: '李云腾',
        sex: '女',
        sexItems: [
          {
            value: '男', label: '男'
          },
          {
            value: '女', label: '女'
          }
        ],
        habit: ['🏸'],
        habitItems: [
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
        ],
        birthday: new Date(),
        avatar: [{ src: 'https://www.baidu.com/img/bd_logo1.png' }]
      },
      storeData2: {
        lastName: '',
        firstName: '',
        phone: '18888888888',
        phoneType: 'mobile',
        phoneTypeOptions: [
          {
            label: '座机',
            value: 'phone'
          },
          {
            label: '手机',
            value: 'mobile'
          }
        ],
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
        desc: ''
      },
      dynamicNameRule: [
        {
          name: 'required',
          value: true,
          trigger: 'blur'
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
          trigger: 'change'
        }
      ],
      isValidating: false,
      validators: {
        'start,end' (values, refs) {
          if (!values.start || !values.end) {
            return true
          }

          if (parseInt(values.start, 10) >= parseInt(values.end, 10)) {
            refs.start.setValidity('下限必须小于上限')
            return false
          } else {
            refs.start.hideValidity() && refs.end.hideValidity()
            return true
          }
        },
        'phone' (values, refs) {
          return new Promise(function (resolve, reject) {
            setTimeout(function () {
              if (values.phone === '18888888888') {
                refs.phone.setValidity('该手机已被注册')
                return reject('该手机已被注册')
              } else {
                refs.phone.hideValidity()
                return resolve()
              }
            }, 3000)
          })
        }
      },
      afterValidate () {
        bus.$emit('log', 'afterValidate')
        this.$vnode.context.isValidating = false
      }
    }
  },

  computed: {
    outputData () {
      let nickName = '🇨🇳 ' + this.storeData1.nickName || ''
      let sex = this.storeData1.sex === '男' ? '👔' : '👗'
      let habit = this.storeData1.habit.join(' ')
      let phone = '📞 ' + this.storeData1.phone
      let birthdayObj = moment(this.storeData1.birthday)
      let birthday = birthdayObj.isValid() ? birthdayObj.format('YYYY年M月D日') : ''
      return {
        nickName,
        sex,
        habit,
        phone,
        birthday,
        avatar: this.storeData1.avatar[0].src
      }
    }
  },

  methods: {
    setLoading (e) {
      this.isValidating = true
      // TODO: 需要 BUTTON 修改
      this.$refs.form2._handleSubmit()
    },
    handleInvalid (e) {
      bus.$emit('log', 'handleInvalid', e)
      this.isValidating = false
    },
    submit (data, e) {
      bus.$emit('log', 'submit', data, e)
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
}
</style>
