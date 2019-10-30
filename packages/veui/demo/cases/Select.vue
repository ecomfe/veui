<template>
<article>
  <h1><code>&lt;veui-select&gt;</code></h1>
  <section>
    <h2>4 种大小：</h2>
    <veui-form>
      <veui-field
        v-for="ui in sizes"
        :key="ui"
        :ui="ui"
        :label="ui"
      >
        <veui-select
          v-model="defaultValue1"
          :ui="ui"
          v-bind="attrs"
          placeholder="全部"
          clearable
          :filter="filter"
        />
      </veui-field>
    </veui-form>
  </section>
  <section>
    <h2>默认样式：</h2>
    <veui-select
      v-model="defaultValue"
      v-bind="attrs"
      placeholder="全部"
      clearable
    />
  </section>
  <section>
    <h2>多选样式：xs</h2>
    <veui-select
      v-model="defaultMultiValue"
      ui="xs"
      v-bind="attrs"
      placeholder="全部"
      :max="3"
      clearable
      multiple
    />
  </section>
  <section>
    <h2>多选样式：s</h2>
    <veui-select
      v-model="defaultMultiValue"
      ui="s"
      v-bind="attrs"
      placeholder="全部"
      :max="3"
      clearable
      multiple
    />
  </section>
  <section>
    <h2>多选样式：m (默认)</h2>
    <veui-select
      v-model="defaultMultiValue"
      v-bind="attrs"
      placeholder="全部"
      clearable
      multiple
    />
  </section>
  <section>
    <h2>多选样式：l</h2>
    <veui-select
      v-model="defaultMultiValue"
      ui="l"
      v-bind="attrs"
      placeholder="全部"
      clearable
      multiple
    />
  </section>
  <section>
    <h2>多选样式：有限制</h2>
    <veui-select
      v-model="defaultMultiValue"
      placeholder="全部"
      v-bind="attrs"
      :max="4"
      clearable
      multiple
    />
  </section>
  <section>
    <h2>多选样式：禁用</h2>
    <veui-select
      v-model="defaultMultiValue"
      v-bind="attrs"
      placeholder="全部"
      clearable
      multiple
      disabled
    />
  </section>
  <section>
    <h2>可搜索Select：</h2>
    <veui-select
      v-model="defaultValue2"
      v-bind="attrs"
      ui="checkmark"
      searchable
    />
  </section>
  <section>
    <h2>可搜索多选Select：</h2>
    <veui-select
      v-model="defaultSearchMultiValue"
      v-bind="attrs"
      searchable
      multiple
    />
  </section>
  <section>
    <h2>可搜索多选Select：有限制</h2>
    <veui-select
      v-model="defaultSearchMultiValue"
      v-bind="attrs"
      :max="4"
      searchable
      multiple
    />
  </section>
  <section>
    <h2>只读样式：</h2>
    <veui-select
      v-model="defaultValue1"
      v-bind="attrs"
      readonly
    />
  </section>
  <section>
    <h2>禁用样式：</h2>
    <veui-select
      v-model="defaultValue1"
      v-bind="attrs"
      disabled
    />
  </section>
  <section>
    <h2>Slot[name=option-label] 样式：</h2>
    <veui-select
      v-model="defaultValue3"
      v-bind="attrs"
      ui="alt"
    >
      <template
        slot="option-label"
        slot-scope="props"
      >
        <span class="veui-option-custom-label">
          {{ props.label }}
        </span>
      </template>
    </veui-select>
  </section>
  <section>
    <h2>Slot 样式 2：</h2>
    <veui-select
      v-model="defaultValue4"
      v-bind="attrs"
    >
      <template
        slot="option"
        slot-scope="props"
      >
        <span class="veui-option-label-text">
          {{ props.label }}
        </span>
        <veui-icon name="eye"/>
      </template>
    </veui-select>
  </section>
  <section>
    <h2>Slot 样式 3：</h2>
    <veui-select
      v-model="defaultValue1"
      v-bind="attrs"
    >
      <template
        slot="option"
        slot-scope="props"
      >
        <veui-radio :checked="props.selected">
          {{ props.label }}
        </veui-radio>
      </template>
    </veui-select>
  </section>
  <section>
    <h2>内联样式：</h2>
    <veui-select
      v-model="hero"
      multiple
    >
      <veui-option-group
        position="popup"
        trigger="hover"
      >
        <template
          slot="label"
        >中国 🇨🇳</template>
        <veui-option-group
          label="互联网"
          position="popup"
        >
          <veui-option
            value="baidu"
            label="百度"
          />
          <veui-option
            value="alibaba"
            label="阿里巴巴"
          />
          <veui-option
            value="tencent"
            label="腾讯"
          />
        </veui-option-group>
        <veui-option-group
          label="通信"
          position="popup"
        >
          <veui-option
            value="telecom"
            label="中国电信"
          />
          <veui-option
            value="mobile"
            label="中国移动"
          />
        </veui-option-group>
      </veui-option-group>
      <veui-option-group
        label="美国"
        position="popup"
      >
        <veui-option-group
          label="互联网"
          position="popup"
        >
          <veui-option
            value="google"
            label="Google"
          />
          <veui-option
            value="facebook"
            label="Facebook"
          />
          <veui-option
            value="twitter"
            label="Twitter"
          />
        </veui-option-group>
        <veui-option-group
          label="通信"
          position="popup"
        >
          <veui-option
            value="atnt"
            label="AT&T"
          />
          <veui-option
            value="verizon"
            label="Verizon"
          />
        </veui-option-group>
      </veui-option-group>
    </veui-select>
  </section>
  <section>
    <h2>内联样式 2：</h2>
    <veui-select v-model="phone">
      <veui-option-group label="国产">
        <veui-option
          value="xiaomi"
          label="小米"
        />
        <veui-option
          value="oppo"
          label="OPPO"
        />
        <veui-option
          value="vivo"
          label="vivo"
        />
        <veui-option
          value="smartisan"
          label="坚果"
        />
      </veui-option-group>
      <veui-option-group
        label="非国产"
        position="popup"
      >
        <veui-option-group
          label="美国"
          position="popup"
        >
          <veui-option
            value="apple"
            label="Apple"
          />
          <veui-option
            value="google"
            label="Google"
          />
        </veui-option-group>
        <veui-option-group
          label="日本"
          position="popup"
        >
          <veui-option
            value="sharp"
            label="夏普"
          />
          <veui-option
            value="sony"
            label="索尼"
          />
        </veui-option-group>
        <veui-option-group
          label="韩国"
          position="popup"
        >
          <veui-option
            value="samsung"
            label="三星"
          />
          <veui-option
            value="lg"
            label="LG"
          />
        </veui-option-group>
      </veui-option-group>
    </veui-select>
  </section>
  <section style="margin-top:500px;">
    <h2>可搜索分组样式：</h2>
    <veui-select
      v-model="defaultValue5"
      v-bind="optGroupAttrs"
      searchable
    />
  </section>
  <section>
    <h2>显示已选图标分组样式：</h2>
    <veui-select
      v-model="defaultValue6"
      v-bind="optGroupAttrs"
      ui="checkmark"
    />
  </section>
  <section>
    <h2>Slot 分组样式 1：</h2>
    <veui-select
      v-model="defaultValue7"
      v-bind="optGroupAttrs"
    >
      <template
        slot="option"
        slot-scope="props"
      >
        <div class="veui-option-custom">
          {{ props.label }}
        </div>
      </template>
    </veui-select>
  </section>
  <section>
    <h2>Slot[name=option] 分组样式 2：</h2>
    <veui-select
      v-model="defaultValue8"
      v-bind="optGroupAttrs"
      :overlay-options="{
        position: 'top right'
      }"
    >
      <template
        slot="option"
        slot-scope="props"
      >
        <span class="veui-option-label-text veui-option-custom-label">
          {{ props.label }}
        </span>
        <veui-icon name="gift"/>
      </template>
    </veui-select>
  </section>
  <section>
    <h2>分隔线样式：</h2>
    <veui-select
      v-model="defaultValue9"
      v-bind="optGroupAttrs"
      :options="groupedOpts"
    />
  </section>
  <section>
    <h2>内联样式 3：</h2>
    <veui-select
      v-model="defaultValue10"
      clearable
    >
      <template
        slot="group-label"
        slot-scope="{ label }"
      >
        <b>{{ label }}</b>
      </template>
      <veui-option-group label="字母">
        <veui-option
          value="A"
          label="选项 A"
        />
        <veui-option
          value="B"
          label="选项 B"
        />
        <veui-option
          value="C"
          label="选项 C"
        />
      </veui-option-group>
      <veui-option-group label="数字">
        <veui-option
          value="1"
          label="选项 1"
        />
        <veui-option
          value="2"
          label="选项 2"
        />
        <veui-option
          value="3"
          label="选项 3"
        />
      </veui-option-group>
    </veui-select>
  </section>
</article>
</template>

<script>
import bus from '../bus'
import { Icon, Select, Option, OptionGroup, Radio, Field, Form } from 'veui'
import type from 'veui/managers/type'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/gift'

export default {
  name: 'select-demo',
  components: {
    'veui-select': Select,
    'veui-option': Option,
    'veui-option-group': OptionGroup,
    'veui-radio': Radio,
    'veui-icon': Icon,
    'veui-field': Field,
    'veui-form': Form
  },
  data () {
    return {
      filter: ({ label }) => {
        return label.indexOf(this.keyword) !== -1
      },
      keyword: '',
      phone: null,
      hero: ['baidu'],
      disabled: true,
      selected: true,
      icon: true,
      defaultValue: null,
      defaultMultiValue: null,
      defaultSearchMultiValue: [1],
      defaultValue1: null,
      defaultValue2: 2,
      defaultValue3: null,
      defaultValue4: null,
      defaultValue5: null,
      defaultValue6: null,
      defaultValue7: null,
      defaultValue8: '1-1',
      defaultValue9: null,
      defaultValue10: null,
      sizes: ['xs', 's', 'm', 'l'],
      attrs: {
        name: 'age',
        readonly: false,
        disabled: false,
        clearable: true,
        options: [
          {
            label: '下拉选项111',
            value: 1
          },
          {
            label: '下拉选项下拉选项下拉选项112',
            value: 2
          },
          {
            label: '下拉选项122',
            value: 3
          },
          {
            label: '下拉选项222',
            value: 4
          }
        ]
      },
      optGroupAttrs: {
        name: 'name',
        readonly: false,
        disabled: false,
        clearable: true,
        options: [
          {
            label: '下拉选项1',
            position: 'popup',
            options: [
              {
                label: '子选项1',
                value: '1-1'
              },
              {
                label: '子选项子选项子选项子选项子选项子选项2',
                value: '1-2'
              },
              {
                label: '子选项3',
                value: '1-3'
              }
            ]
          },
          {
            label: '下拉选项下拉选项下拉选项2',
            options: [
              {
                label: '子选项1',
                value: '2-1'
              },
              {
                label: '子选项2',
                value: '2-2'
              },
              {
                label: '子选项子选项子选项子选项子选项子选项3',
                value: '2-3'
              }
            ]
          },
          {
            label: '下拉选项3',
            options: [
              {
                label: '子选项1',
                value: '3-1'
              },
              {
                label: '子选项2',
                value: '3-2'
              },
              {
                label: '子选项子选项子选项子选项子选项子选项3',
                value: '3-3'
              }
            ]
          },
          {
            label: '下拉选项4',
            options: [
              {
                label: '子选项子选项子选项子选项子选项子选项1',
                value: '4-1'
              },
              {
                label: '子选项2',
                value: '4-2'
              },
              {
                label: '子选项3',
                value: '4-3'
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    groupedOpts () {
      return type
        .clone(this.optGroupAttrs.options)
        .map(group => {
          delete group.label
          delete group.position
          return group
        })
        .reduce((acc, cur) => {
          acc.push(cur)
          return acc
        }, [])
    }
  },
  mounted () {
    this.$children.forEach(child => {
      child.$on('click', () => {
        bus.$emit('log', child.$el.getAttribute('ui'))
      })
    })
  },
  methods: {
    change (value) {
      // alert('您选中的下拉选项值是' + value)
    }
  }
}
</script>

<style lang="less" scoped>
.veui-option-label {
  &-text,
  .veui-icon {
    vertical-align: middle;
  }

  .veui-icon {
    margin-left: 5px;
  }
}

.veui-option-custom {
  position: relative;
  padding-left: 24px;
  &::after {
    content: '❤️';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  &-label {
    color: rgb(80, 170, 39);
  }
}

.filter {
  width: ~'calc(100% - 10px)';
  margin: 5px;
}
</style>
