<template>
<article>
  <h1>
    <code>&lt;veui-config-provider&gt;</code>
  </h1>

  <section>
    <h3>配置子主题</h3>
    <veui-stack class="config" gap="s">
      <code>theme</code>
      <veui-checkbox v-model="d22">D22</veui-checkbox>
    </veui-stack>
    <section class="case">
      <veui-config-provider :value="contextValue">
        <veui-collapse expanded label="Provide theme">
          <veui-input clearable/>
        </veui-collapse>
      </veui-config-provider>
    </section>
    <section class="case">
      <veui-collapse
        expanded
        label="UI theme"
        :ui="contextValue.theme ? `theme:${contextValue.theme}` : null"
      >
        <veui-input clearable/>
      </veui-collapse>
    </section>
  </section>

  <section>
    <h3>配置 Select 的 placeholder</h3>
    <veui-stack class="config" gap="s">
      <code>select.placeholder</code>
      <veui-input v-model="placeholder"/>
    </veui-stack>
    <section class="case">
      <veui-config-provider :value="contextValue">
        <veui-select :options="options" clearable/>
      </veui-config-provider>
    </section>
  </section>

  <section>
    <h3>配置 Button 的 ui</h3>
    <veui-stack class="config" gap="s">
      <code>button.icons.loading</code>
      <veui-switch v-model="loadingIcon"/>
    </veui-stack>
    <veui-stack class="config" gap="s">
      <code>button.ui.style.default</code>
      <veui-radio-group
        v-model="style"
        :items="styles"
        style="display: inline-block"
      />
    </veui-stack>
    <section class="case">
      <veui-config-provider :value="contextValue">
        <veui-button loading>按钮</veui-button>
      </veui-config-provider>
    </section>
  </section>

  <section>
    <h3>配置 Autocomplete 的搜索逻辑</h3>
    <veui-stack class="config" gap="s">
      <code>searchable.match/searchable.filter</code>
      <veui-radio-group
        v-model="searchLogic"
        :items="searchItems"
        style="display: inline-block"
      />
    </veui-stack>
    <section class="case">
      <veui-config-provider :value="contextValue">
        <veui-autocomplete
          v-model="autoValue"
          :datasource="options"
          expanded
        />
      </veui-config-provider>
    </section>
  </section>

  <section>
    <h3>配置 icon</h3>
    <section>
      <veui-checkbox v-model="override"> Override icons </veui-checkbox>
    </section>
    <section class="case">
      <veui-config-provider :value="config">
        <veui-form>
          <veui-field label="Date" tip="The date must be earlier than today">
            <veui-date-picker/>
          </veui-field>
        </veui-form>
      </veui-config-provider>
    </section>
  </section>
</article>
</template>

<script>
import {
  ConfigProvider,
  Select,
  Autocomplete,
  Input,
  RadioGroup,
  Button,
  Switch,
  Form,
  Field,
  DatePicker,
  Checkbox,
  Stack,
  Collapse,
  ui
} from 'veui'
import { IconQuestionCircleSolid, IconCalendarSolid } from 'dls-icons-vue'

export default {
  name: 'config-provider-demo',
  components: {
    'veui-config-provider': ConfigProvider,
    'veui-select': Select,
    'veui-input': Input,
    'veui-button': Button,
    'veui-radio-group': RadioGroup,
    'veui-autocomplete': Autocomplete,
    'veui-switch': Switch,
    'veui-form': Form,
    'veui-field': Field,
    'veui-date-picker': DatePicker,
    'veui-checkbox': Checkbox,
    'veui-stack': Stack,
    'veui-collapse': Collapse
  },
  data () {
    return {
      placeholder: undefined,
      autoValue: '大',
      searchLogic: '',
      loadingIcon: false,
      style: 'normal',
      override: true,
      d22: false
    }
  },
  computed: {
    options () {
      return [
        { label: '工程师培训', value: '12' },
        { label: '大数据培训班', value: '13' },
        { label: '双眼皮产品类', value: '14' },
        { label: '分散机', value: '15' },
        { label: '编码器', value: '16' },
        { label: '相亲中介', value: '17' }
      ]
    },
    styles () {
      return [
        { label: 'normal', value: 'normal' },
        { label: 'primary', value: 'primary' }
      ]
    },
    searchItems () {
      return [
        { label: '默认', value: '' },
        { label: '全中无高亮', value: 'all_wh' },
        { label: '全中有高亮', value: 'all_h' }
      ]
    },
    contextValue () {
      return {
        // undefined 让默认 contextValue 生效
        'select.placeholder': this.placeholder || undefined,
        'searchable.filter': this.searchLogic === 'all_h' && (() => true),
        'searchable.match': this.searchLogic === 'all_wh' && (() => true),
        ...(this.loadingIcon
          ? { 'button.icons.loading': ui.get('alert.icons').success }
          : {}),
        'button.ui.style.default': this.style,
        theme: this.d22 ? 'd22' : null
      }
    },
    config () {
      return this.override
        ? {
          'field.icons.tip': IconQuestionCircleSolid,
          'datepicker.icons.calendar': IconCalendarSolid
        }
        : {}
    }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 24px;
}

.config {
  margin-bottom: 16px;
}

.case {
  background-color: #f8f8f8;
  padding: 16px;
  border-radius: 6px;
}
</style>
