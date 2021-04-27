<template>
<article>
  <h1><code>&lt;veui-cascader&gt;</code></h1>
  <section>
    <h3>Single Cascader</h3>
    <div class="cascader-config">
      <veui-checkbox v-model="searchable1">Searchable</veui-checkbox>
      <veui-checkbox
        v-model="selectMode1"
        true-value="leaf-only"
        false-value="any"
      >Only select leaves</veui-checkbox>
      <veui-checkbox v-model="clearable1">Clearable</veui-checkbox>
      <veui-checkbox v-model="inline1">Inline</veui-checkbox>
      <veui-checkbox
        v-model="verboseBackfill1"
        true-value="complete"
        false-value="simple"
      >逐级展示</veui-checkbox>
      <veui-radio
        v-model="trigger1"
        value="click"
        name="columnTrigger"
      >点击展开</veui-radio>
      <veui-radio
        v-model="trigger1"
        value="hover"
        name="columnTrigger"
      >hover展开</veui-radio>
      <label>
        列宽度:
        <veui-input v-model="columnWidth1"/>
      </label>
    </div>
    <cascader
      v-model="value1"
      :options="options"
      :searchable="searchable1"
      :expanded.sync="expanded1"
      :select-mode="selectMode1"
      :column-trigger="trigger1"
      :clearable="clearable1"
      :value-display="verboseBackfill1"
      :inline="inline1"
      :column-width="getRealColumnWidth(columnWidth1)"
    />
  </section>
  <section>
    <h3>Multiple Cascader</h3>
    <div class="cascader-config">
      <veui-checkbox v-model="searchable2">Searchable</veui-checkbox>
      <veui-checkbox v-model="clearable2">Clearable</veui-checkbox>
      <veui-checkbox v-model="inline2">Inline</veui-checkbox>
      <veui-checkbox v-model="showSelectAll2">有全选</veui-checkbox>
      <veui-radio
        v-model="trigger2"
        value="click"
        name="columnTrigger2"
      >点击展开</veui-radio>
      <veui-radio
        v-model="trigger2"
        value="hover"
        name="columnTrigger2"
      >hover展开</veui-radio>
      <label>
        Max:
        <veui-number-input v-model="max2"/>
      </label>
      <label>
        列宽度:
        <veui-input v-model="columnWidth2"/>
      </label>
    </div>
    <cascader
      v-model="value2"
      :options="options"
      :searchable="searchable2"
      :expanded.sync="expanded2"
      :column-trigger="trigger2"
      :clearable="clearable2"
      :inline="inline2"
      :show-select-all="showSelectAll2"
      :max="max2"
      :column-width="getRealColumnWidth(columnWidth2)"
      multiple
    />
  </section>
  <section>
    <h3>Slots: before/after/column-before/column-after</h3>
    <cascader
      v-model="value2"
      :options="options"
      :searchable="searchable2"
      :expanded.sync="expanded3"
      :column-trigger="trigger2"
      :clearable="clearable2"
      :inline="inline2"
      multiple
    >
      <template slot="before">
        <div class="center-align">before</div>
      </template>
      <template slot="after">
        <div class="center-align">after</div>
      </template>
      <template slot="column-before">
        <div class="center-align">column-before</div>
      </template>
      <template slot="column-after">
        <div class="center-align">column-after</div>
      </template>
    </cascader>
  </section>
  <section>
    <h3>Sizes: xs/s/m/l</h3>
    <div class="size-wrap">
      <span class="size">xs:</span>
      <cascader
        v-model="value2"
        :options="options"
        :searchable="searchable2"
        :column-trigger="trigger2"
        :clearable="clearable2"
        :inline="inline2"
        ui="xs"
        multiple
      >
        <template slot="before">
          <div class="center-align">before</div>
        </template>
        <template slot="after">
          <div class="center-align">after</div>
        </template>
        <template slot="column-before">
          <div class="center-align">column-before</div>
        </template>
        <template slot="column-after">
          <div class="center-align">column-after</div>
        </template>
      </cascader>
    </div>
    <div class="size-wrap">
      <span class="size">s:</span>
      <cascader
        :options="options"
        :searchable="searchable1"
        :select-mode="selectMode1"
        :column-trigger="trigger1"
        :clearable="clearable1"
        :inline="inline1"
        ui="s"
      />
    </div>
    <div class="size-wrap">
      <span class="size">m:</span>
      <cascader
        :options="options"
        :searchable="searchable1"
        :select-mode="selectMode1"
        :column-trigger="trigger1"
        :clearable="clearable1"
        :inline="inline1"
        ui="m"
      />
    </div>
    <div class="size-wrap">
      <span class="size">l:</span>
      <cascader
        :options="options"
        :searchable="searchable2"
        :column-trigger="trigger2"
        :clearable="clearable2"
        :inline="inline2"
        ui="l"
        multiple
      />
    </div>
  </section>
  <section>
    <h3>Disabled</h3>
    <cascader
      :options="options"
      :searchable="searchable2"
      :column-trigger="trigger2"
      :clearable="clearable2"
      :inline="inline2"
      disabled
    />
  </section>
  <section>
    <h3>Readonly</h3>
    <cascader
      :options="options"
      :searchable="searchable2"
      :column-trigger="trigger2"
      :clearable="clearable2"
      :inline="inline2"
      readonly
    />
  </section>
</article>
</template>

<script>
import { Cascader, Checkbox, Radio, NumberInput, Input } from 'veui'

export default {
  name: 'cascader-demo',
  components: {
    Cascader,
    'veui-checkbox': Checkbox,
    'veui-radio': Radio,
    'veui-number-input': NumberInput,
    'veui-input': Input
  },
  data () {
    return {
      value1: null,
      expanded1: false,
      searchable1: true,
      selectMode1: false,
      trigger1: 'click',
      clearable1: true,
      inline1: false,
      columnWidth1: '',
      verboseBackfill1: false,

      value2: null,
      expanded2: false,
      searchable2: true,
      trigger2: 'click',
      clearable2: true,
      inline2: false,
      columnWidth2: '',
      showSelectAll2: false,
      max2: null,

      expanded3: false,
      options: [
        {
          label: '浙江',
          value: '浙江',
          position: 'inline',
          options: [
            {
              label: '威海',
              value: '威海'
            },
            {
              label: '滨州',
              value: '滨州'
            },
            {
              label: '临沂',
              value: '临沂'
            },
            {
              label: '东营',
              value: '东营'
            },
            {
              label: '济南',
              value: '济南'
            }
          ]
        },
        {
          label: '山东',
          value: '山东',
          options: [
            {
              label: '菏泽',
              value: '菏泽',
              options: [
                {
                  label: '菏泽1',
                  value: '菏泽1'
                }
              ]
            },
            {
              label: '潍坊',
              value: '潍坊',
              options: [
                {
                  label: '潍坊1',
                  value: '潍坊1'
                }
              ]
            },
            {
              label: '泰山',
              value: '泰山'
            },
            {
              label: '烟台',
              value: '烟台'
            },
            {
              label: '华山',
              value: '华山'
            },
            {
              label: '衡山',
              value: '衡山'
            },
            {
              label: '嵩山',
              value: '嵩山'
            },
            {
              label: '恒山',
              value: '恒山'
            },
            {
              label: '大雪山',
              value: '大雪山'
            }
          ]
        },
        {
          label: '上海',
          value: '上海',
          disabled: true
        },
        {
          label: '北京',
          value: '北京'
        },
        {
          label: '海外',
          value: '海外',
          disabled: true,
          options: [
            {
              label: '日本',
              value: '日本'
            }
          ]
        }
      ]
    }
  },
  methods: {
    getRealColumnWidth (val) {
      if (val && !isNaN(+val)) {
        return `${+val}px`
      }
      return val
    }
  }
}
</script>

<style lang="less" scoped>
.cascader-config {
  display: flex;
  align-items: center;
  height: 32px;
  & > * {
    margin-right: 32px;
  }
  .veui-input {
    width: 80px;
  }
}
.size-wrap {
  display: flex;
  min-height: 40px;
  align-items: center;
  .size {
    display: inline-block;
    width: 2em;
  }
}
</style>
