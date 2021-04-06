<template>
<article>
  <h1><code>&lt;veui-cascader&gt;</code></h1>
  <section>
    <h3>Single Cascader</h3>
    <div class="cascader-config">
      <veui-checkbox v-model="searchable1">Searchable</veui-checkbox>
      <veui-checkbox
        v-model="selectLeaves1"
      >Only select leaves</veui-checkbox>
      <veui-checkbox v-model="clearable1">Clearable</veui-checkbox>
      <veui-checkbox v-model="inline1">Inline</veui-checkbox>
      <veui-checkbox v-model="verboseBackfill1">逐级展示</veui-checkbox>
      <veui-radio
        v-model="trigger1"
        value="click"
        name="expandTrigger"
      >expand: click</veui-radio>
      <veui-radio
        v-model="trigger1"
        value="hover"
        name="expandTrigger"
      >expand: hover</veui-radio>
    </div>
    <cascader
      v-model="value1"
      :options="options"
      :searchable="searchable1"
      :expanded.sync="expanded1"
      :select-leaves="selectLeaves1"
      :expand-trigger="trigger1"
      :clearable="clearable1"
      :verbose-backfill="verboseBackfill1"
      :inline="inline1"
    />
  </section>
  <section>
    <h3>Multiple Cascader</h3>
    <div class="cascader-config">
      <veui-checkbox v-model="searchable2">Searchable</veui-checkbox>
      <veui-checkbox v-model="clearable2">Clearable</veui-checkbox>
      <veui-checkbox v-model="inline2">Inline</veui-checkbox>
      <veui-checkbox v-model="hasSelectAll2">有全选</veui-checkbox>
      <veui-radio
        v-model="trigger2"
        value="click"
        name="expandTrigger2"
      >expand: click</veui-radio>
      <veui-radio
        v-model="trigger2"
        value="hover"
        name="expandTrigger2"
      >expand: hover</veui-radio>
    </div>
    <cascader
      v-model="value2"
      :options="options"
      :searchable="searchable2"
      :expanded.sync="expanded2"
      :expand-trigger="trigger2"
      :clearable="clearable2"
      :inline="inline2"
      :has-select-all="hasSelectAll2"
      multiple
    />
  </section>
  <section>
    <h3>Slots: before/after/menu-before/menu-after</h3>
    <cascader
      v-model="value2"
      :options="options"
      :searchable="searchable2"
      :expanded.sync="expanded3"
      :expand-trigger="trigger2"
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
      <template slot="menu-before">
        <div class="center-align">menu-before</div>
      </template>
      <template slot="menu-after">
        <div class="center-align">menu-after</div>
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
        :expand-trigger="trigger2"
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
        <template slot="menu-before">
          <div class="center-align">menu-before</div>
        </template>
        <template slot="menu-after">
          <div class="center-align">menu-after</div>
        </template>
      </cascader>
    </div>
    <div class="size-wrap">
      <span class="size">s:</span>
      <cascader
        :options="options"
        :searchable="searchable1"
        :select-leaves="selectLeaves1"
        :expand-trigger="trigger1"
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
        :select-leaves="selectLeaves1"
        :expand-trigger="trigger1"
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
        :expand-trigger="trigger2"
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
      :expand-trigger="trigger2"
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
      :expand-trigger="trigger2"
      :clearable="clearable2"
      :inline="inline2"
      readonly
    />
  </section>
</article>
</template>

<script>
import { Cascader, Checkbox, Radio } from 'veui'

export default {
  name: 'cascader-demo',
  components: {
    Cascader,
    'veui-checkbox': Checkbox,
    'veui-radio': Radio
  },
  data () {
    return {
      value1: null,
      expanded1: false,
      searchable1: true,
      selectLeaves1: false,
      trigger1: 'click',
      clearable1: true,
      inline1: false,
      verboseBackfill1: false,

      value2: null,
      expanded2: false,
      searchable2: true,
      trigger2: 'click',
      clearable2: true,
      inline2: false,
      hasSelectAll2: false,

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
  }
}
</script>

<style lang="less" scoped>
.center-align {
  text-align: center;
}
.cascader-config {
  display: flex;
  align-items: center;
  height: 32px;
  & > * {
    margin-right: 32px;
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
