<template>
<section :class="{ compact: 'compact' in $route.query }">
  <h1>Light Design 表单测试实验</h1>
  <v-form :data="data">
    <section class="block">
      <h1>个人基本信息</h1>
      <v-field
        label="姓名"
        field="name"
        rules="required"
      >
        <v-input
          v-model="data.name"
          placeholder="请输入"
          style="width: 160px"
        />
      </v-field>
      <v-field
        label="性别"
        field="gender"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.gender"
          :items="[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]"
        />
      </v-field>
      <v-field
        label="职位"
        field="role"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.role"
          :items="[
            { label: '产品', value: 'pm' },
            { label: '设计', value: 'ux' },
            { label: '研发', value: 'rd' },
            { label: '行政', value: 'admin' },
            { label: '其他', value: 'other' }
          ]"
        />
      </v-field>
      <v-field
        label="手机号码"
        field="mobile"
        rules="required"
      >
        <v-input
          v-model="data.mobile"
          placeholder="请输入"
          style="width: 240px"
        />
      </v-field>
      <v-field
        label="民族"
        field="ethnicity"
        rules="required"
      >
        <v-select
          v-model="data.ethnicity"
          :options="[
            { label: '汉族', value: 'han' },
            { label: '回族', value: 'hui' },
            { label: '壮族', value: 'zhuang' },
            { label: '朝鲜族', value: 'korean' },
            { label: '其他', value: 'other' }
          ]"
          style="width: 150px"
        />
        <v-span class="aux">请选择 汉族</v-span>
      </v-field>
      <v-fieldset
        label="出生年月"
        required
      >
        <v-field
          field="birthYear"
          rules="required"
        >
          <v-select
            v-model="data.birthYear"
            placeholder="年"
            :options="getSequenceOptions(1995, 1990)"
            style="width: 120px"
          />
        </v-field>
        <v-field
          field="birthMonth"
          rules="required"
        >
          <v-select
            v-model="data.birthMonth"
            placeholder="月"
            :options="months"
            style="width: 120px"
          />
        </v-field>
        <v-span class="aux">请选择 1994 年 5 月</v-span>
      </v-fieldset>
      <v-field
        label="星座"
        field="constellation"
        rules="required"
      >
        <v-select
          v-model="data.constellation"
          :options="[
            { label: '摩羯座', value: 'capricorn' },
            { label: '水瓶座', value: 'aquarius' },
            { label: '双鱼座', value: 'pisces' },
            { label: '白羊座', value: 'aries' },
            { label: '金牛座', value: 'taurus' },
            { label: '其他', value: 'other' }
          ]"
          style="width: 150px"
        />
        <v-span class="aux">请选择 金牛座</v-span>
      </v-field>
      <v-field
        label="婚姻状况"
        field="maritalStatus"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.maritalStatus"
          :items="[
            { label: '已婚', value: 'married' },
            { label: '未婚', value: 'not-married' }
          ]"
        />
        <v-span class="aux">请选择 已婚</v-span>
      </v-field>
      <v-field
        label="学历"
        field="acdemic"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.acdemic"
          :items="[
            { label: '本科', value: 'bachelors' },
            { label: '硕士', value: 'master' },
            { label: '博士', value: 'phd' },
            { label: '博士后', value: 'postdoctoral' },
            { label: '其他', value: 'other' }
          ]"
        />
        <v-span class="aux">请选择 硕士</v-span>
      </v-field>
      <v-fieldset
        label="毕业年月"
        required
      >
        <v-field
          field="graduateYear"
          rules="required"
        >
          <v-select
            v-model="data.graduateYear"
            placeholder="年"
            :options="getSequenceOptions(2020, 2015)"
            style="width: 100px"
          />
        </v-field>
        <v-field
          field="graduateMonth"
          rules="required"
        >
          <v-select
            v-model="data.graduateMonth"
            placeholder="月"
            :options="months"
            style="width: 100px"
          />
        </v-field>
        <v-span class="aux">请选择 2016 年 6 月</v-span>
      </v-fieldset>
      <v-field
        label="毕业院校"
        field="colledge"
        rules="required"
      >
        <v-input
          v-model="data.colledge"
          placeholder="请输入"
          style="width: 160px"
        />
        <v-span class="aux">请选择 北京大学</v-span>
      </v-field>
      <v-fieldset
        label="家庭住址"
        required
      >
        <v-field
          field="city"
          rules="required"
        >
          <v-select
            v-model="data.city"
            placeholder="市"
            :options="[
              { label: '北京市', value: 'beijing' },
              { label: '天津市', value: 'tianjin' },
              { label: '南京市', value: 'nanjing' },
              { label: '杭州市', value: 'hangzhou' },
              { label: '深圳市', value: 'shenzhen' }
            ]"
            style="width: 100px"
          />
        </v-field>
        <v-field
          field="district"
          rules="required"
        >
          <v-select
            v-model="data.district"
            placeholder="区"
            :options="[
              { label: '海淀区', value: 'haidian' },
              { label: '朝阳区', value: 'chaoyang' },
              { label: '顺义区', value: 'shunyi' },
              { label: '大兴区', value: 'daxing' },
              { label: '丰台区', value: 'fengtai' }
            ]"
            style="width: 100px"
          />
        </v-field>
        <v-span class="aux">请选择 北京市 海淀区</v-span>
      </v-fieldset>
      <v-field
        label="邮政编码"
        field="zip"
        rules="required"
      >
        <v-input
          v-model="data.zip"
          placeholder="请输入"
          style="width: 160px"
        />
        <v-span class="aux">请输入 112233</v-span>
      </v-field>
      <v-field
        label="爱好"
        field="hobbies"
        rules="required"
      >
        <v-check-button-group
          v-model="data.hobbies"
          :items="[
            { label: '音乐', value: 'music' },
            { label: '舞蹈', value: 'dancing' },
            { label: '体育', value: 'sports' },
            { label: '文学', value: 'literature' },
            { label: '烹饪', value: 'cooking' },
            { label: '旅游', value: 'traveling' }
          ]"
        />
        <v-span class="aux">请选择 舞蹈、体育</v-span>
      </v-field>
    </section>
    <section class="block">
      <h1>工作情况</h1>
      <v-field
        label="入职时间"
        field="onboardYear"
        rules="required"
      >
        <v-select
          v-model="data.onboardYear"
          placeholder="年"
          :options="getSequenceOptions(2020, 2015)"
          style="width: 100px"
        />
        <v-span class="aux">请选择 2020 年</v-span>
      </v-field>
      <v-field
        label="公司名称"
        field="company"
        rules="required"
      >
        <v-input
          v-model="data.company"
          placeholder="请输入"
          style="width: 240px"
        />
        <v-span class="aux">请输入 百度</v-span>
      </v-field>
      <v-field
        field="department"
        rules="required"
      >
        <v-select
          v-model="data.department"
          :options="[
            { label: '产品部', value: 'prod' },
            { label: '用户体验部', value: 'ue' },
            { label: '行政部', value: 'admin' },
            { label: '其他', value: 'other' }
          ]"
          style="width: 150px"
        />
        <v-span class="aux">请选择 产品部</v-span>
      </v-field>
      <v-field
        label="工作年限"
        field="experience"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.experience"
          :items="[
            { label: '1–3年', value: 'junior' },
            { label: '3–5年', value: 'senior' },
            { label: '5年以上', value: 'expert' }
          ]"
        />
        <v-span class="aux">请选择 3–5 年</v-span>
      </v-field>
      <v-field
        label="工资水平"
        field="salary"
        rules="required"
      >
        <v-select
          v-model="data.salary"
          :options="[
            { label: '10000–20000', value: 'a' },
            { label: '20000–30000', value: 'b' },
            { label: '30000–40000', value: 'c' }
          ]"
          style="width: 150px"
        />
        <v-span class="aux">请选择 20000–30000</v-span>
      </v-field>
      <v-field
        label="工作类型"
        field="type"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.type"
          :items="[
            { label: '正式', value: 'fte' },
            { label: '实习', value: 'intern' }
          ]"
        />
        <v-span class="aux">请选择 正式</v-span>
      </v-field>
      <v-field
        label="职级"
        field="level"
        rules="required"
      >
        <v-select
          v-model="data.level"
          :options="[
            { label: 'T3', value: '3' },
            { label: 'T4', value: '4' },
            { label: 'T5', value: '5' },
            { label: 'T6', value: '6' },
            { label: 'T7', value: '7' }
          ]"
          style="width: 100px"
        />
        <v-span class="aux">请选择 T5</v-span>
      </v-field>
      <v-field
        label="公司邮箱"
        field="email"
        rules="required"
      >
        <v-input
          v-model="data.email"
          placeholder="请输入"
          style="width: 160px"
        />
        <v-span>@baidu.com</v-span>
        <v-span class="aux">请输入 778899</v-span>
      </v-field>
      <v-field
        label="工号"
        field="id"
        rules="required"
      >
        <v-input
          v-model="data.id"
          placeholder="请输入"
          style="width: 160px"
        />
        <v-span class="aux">请输入 445566</v-span>
      </v-field>
      <v-fieldset
        label="工位"
        required
      >
        <v-field
          field="office"
          rules="required"
        >
          <v-select
            v-model="data.office"
            placeholder="楼"
            :options="[
              { label: '一号楼', value: '1' },
              { label: '二号楼', value: '2' },
              { label: '三号楼', value: '3' }
            ]"
            style="width: 100px"
          />
        </v-field>
        <v-field
          field="floor"
          rules="required"
        >
          <v-select
            v-model="data.floor"
            placeholder="层"
            :options="[
              { label: '1层', value: '1' },
              { label: '2层', value: '2' },
              { label: '3层', value: '3' }
            ]"
            style="width: 100px"
          />
        </v-field>
        <v-span class="aux">请选择 三号楼 3 层</v-span>
      </v-fieldset>
      <v-field
        label="电脑型号"
        field="computer"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.computer"
          :items="[
            { label: 'Windows', value: 'win' },
            { label: 'Mac', value: 'mac' },
            { label: '其他', value: 'other' }
          ]"
        />
        <v-span class="aux">请选择 Mac</v-span>
      </v-field>
      <v-field
        label="手机品牌"
        field="mobileBrand"
        rules="required"
      >
        <v-radio-button-group
          v-model="data.mobileBrand"
          :items="[
            { label: '苹果', value: 'apple' },
            { label: '华为', value: 'huawei' },
            { label: 'OPPO', value: 'oppo' },
            { label: 'vivo', value: 'vivo' }
          ]"
        />
        <v-span class="aux">请选择 vivo</v-span>
      </v-field>
      <v-field
        label="通勤方式"
        field="commuting"
        rules="required"
      >
        <v-check-button-group
          v-model="data.commuting"
          :items="[
            { label: '自驾', value: 'drive' },
            { label: '打车', value: 'taxi' },
            { label: '公交', value: 'bus' },
            { label: '地铁', value: 'subway' },
            { label: '班车', value: 'shuttle-bus' },
            { label: '其他', value: 'other' }
          ]"
        />
        <v-span class="aux">请选择 公交、地铁</v-span>
      </v-field>
    </section>
    <section class="block">
      <v-button
        ui="primary"
        type="submit"
      >提交</v-button>
    </section>
  </v-form>
</section>
</template>

<script>
import {
  VForm,
  VField,
  VFieldset,
  VInput,
  VRadioButtonGroup,
  VCheckButtonGroup,
  VSelect,
  VSpan,
  VButton
} from 'veui'

export default {
  components: {
    VForm,
    VField,
    VFieldset,
    VInput,
    VRadioButtonGroup,
    VCheckButtonGroup,
    VSelect,
    VSpan,
    VButton
  },
  data () {
    return {
      months: this.getSequenceOptions(1, 12),
      data: {
        name: '',
        gender: null,
        role: null,
        mobile: '',
        ethnicity: null,
        birthYear: null,
        birthMonth: null,
        constellation: null,
        maritalStatus: null,
        acdemic: null,
        graduateYear: null,
        graduateMonth: null,
        colledge: '',
        city: '',
        district: '',
        zip: '',
        hobbies: null,
        onboardYear: null,
        company: null,
        department: null,
        experience: null,
        salary: null,
        type: null,
        level: null,
        email: '',
        id: null,
        office: null,
        floor: null,
        computer: null,
        mobileBrand: null,
        commuting: null
      }
    }
  },
  methods: {
    getSequenceOptions (start, end) {
      return Array.from({ length: Math.abs(start - end) + 1 })
        .map((_, i) => start + i * Math.sign(end - start))
        .map(val => ({ label: String(val), value: val }))
    }
  }
}
</script>

<style scoped>
h1 {
  border: none;
  margin: 0 0 24px;
  padding: 0;
}

.block {
  background-color: #fff;
  padding: 20px 28px;
}

.veui-span {
  margin-left: 8px;
}

.veui-span.aux {
  color: #848b99;
}

.veui-fieldset .veui-field + .veui-field {
  margin-left: 8px;
}

.veui-form >>> .veui-field .veui-field-no-label {
  margin-bottom: 0 !important;
}

.compact >>> .veui-form .veui-field {
  margin-bottom: 24px !important;
}

.compact >>> .veui-field-error {
  top: calc(100% + 2px);
}
</style>
