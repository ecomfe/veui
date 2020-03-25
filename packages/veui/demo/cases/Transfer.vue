<template>
<article class="veui-transfer-demo">
  <h1><code>&lt;veui-tree&gt;</code></h1>

  <h2>点击左侧图标展开收起</h2>
  <p>当前展开：{{ expanded1 }}</p>
  <veui-tree
    :datasource="treeDatasource1"
    :expanded.sync="expanded1"
  />

  <h2>点击整行展开收起</h2>
  <veui-tree
    :datasource="treeDatasource2"
    item-click="toggle"
  />

  <h1><code>&lt;veui-filter-panel&gt;</code></h1>

  <veui-filter-panel
    :datasource="treeDatasource1"
    class="veui-select-panel-demo1"
  >
    <template slot="head">
      列表
    </template>
    <template slot-scope="{ items }">
      <veui-tree :datasource="items">
        <template
          slot="item-label"
          slot-scope="props"
        >
          <slot
            name="tree-item-label"
            v-bind="props"
          >
            {{ props.item.label }}
          </slot>
        </template>
      </veui-tree>
    </template>
  </veui-filter-panel>

  <h1><code>&lt;veui-transfer&gt;</code></h1>

  <h2>自定义项目内容</h2>
  <veui-transfer
    :datasource="datasource1"
    selected-show-mode="flat"
  >
    <template
      slot="candidate-item-label"
      slot-scope="{ label }"
    >
      <em>{{ label }}</em>
    </template>
    <template
      slot="selected-item-label"
      slot-scope="{ label }"
    >
      <small>{{ label }}</small>
    </template>
  </veui-transfer>

  <h2>多级树形结构</h2>
  <veui-transfer
    v-model="selected1"
    :datasource="datasource1"
  >
    <template slot="candidate-title">
      备选列表（{{ datasource1LeafCount }}）
    </template>
    <template slot="selected-title">
      已选列表（{{ selected1.length }}）
    </template>
  </veui-transfer>

  <h2>单级结构</h2>
  <p>
    <veui-transfer
      v-model="selected2"
      :datasource="datasource2"
    />
  </p>

  <h2>多级树形结构，右侧扁平</h2>
  <p>
    <veui-transfer
      v-model="selected3"
      :datasource="datasource3"
      selected-show-mode="flat"
      ui="s"
    >
      <template slot="candidate-title">
        备选列表（{{ datasource1LeafCount }}）
      </template>
      <template slot="selected-title">
        已选列表（{{ selected3.length }}）
      </template>
    </veui-transfer>
  </p>

  <h2>单级结构，禁用</h2>
  <p>
    <veui-transfer
      v-model="selected4"
      :datasource="datasource4"
      disabled
    >
      <template slot="candidate-title">
        备选列表
      </template>
      <template slot="selected-title">
        已选列表（{{ selected4.length }}）
      </template>
    </veui-transfer>
  </p>

  <h2>多级树形结构，禁用</h2>
  <p>
    <veui-transfer
      v-model="selected5"
      :datasource="datasource5"
      selected-show-mode="flat"
      disabled
    >
      <template slot="candidate-title">
        备选列表（{{ datasource1LeafCount }}）
      </template>
      <template slot="selected-title">
        已选列表（{{ selected5.length }}）
      </template>
    </veui-transfer>
  </p>

  <h2>用于表单</h2>
  <veui-form
    :data="formData"
    :validators="validators"
  >
    <veui-field
      label="咖啡："
      field="selected6"
      name="selected6"
      rules="required"
    >
      <veui-transfer
        v-model="formData.selected6"
        :datasource="datasource6"
        candidate-placeholder="搜索备选列表"
        selected-placeholder="搜索已选列表"
      >
        <template slot="candidate-title">
          备选列表（{{ countLeaves(datasource1) }}）
        </template>
        <template slot="selected-title">
          已选列表（{{ countLeaves(formData.selected6) }}）
        </template>
      </veui-transfer>
    </veui-field>
    <div class="operation">
      <veui-button
        ui="primary"
        type="submit"
      >
        提交
      </veui-button>
    </div>
  </veui-form>
</article>
</template>

<script>
import { Transfer, Form, Field, Button, Tree, FilterPanel } from 'veui'
import { cloneDeep } from 'lodash'

export default {
  name: 'transfer-demo',
  components: {
    'veui-transfer': Transfer,
    'veui-form': Form,
    'veui-field': Field,
    'veui-button': Button,
    'veui-tree': Tree,
    'veui-filter-panel': FilterPanel
  },
  data () {
    let coffees = [
      {
        label: 'Infused',
        value: 'infused',
        children: [
          {
            label: 'Brewed',
            value: 'brewed',
            children: [
              {
                label: 'Drip brewed',
                value: 'drip-brewed'
              },
              {
                label: 'Filtered',
                value: 'filtered',
                disabled: true
              },
              {
                label: 'Pour-over',
                value: 'pour-over'
              },
              {
                label: 'Immersion brewed',
                value: 'immersion-brewed'
              }
            ]
          },
          {
            label: 'French press',
            value: 'french-press'
          },
          {
            label: 'Cold brew',
            value: 'cold-brew'
          }
        ]
      },
      {
        label: 'Boiled',
        value: 'boiled',
        disabled: true,
        children: [
          {
            label: 'Percolated',
            value: 'percolated'
          },
          {
            label: 'Turkish',
            value: 'turkish',
            disabled: true
          },
          {
            label: 'Moka',
            value: 'moka'
          }
        ]
      },
      {
        label: 'Espresso',
        value: 'espresso',
        children: [
          {
            label: 'Caffè Americano',
            value: 'caffe-americano'
          },
          {
            label: 'Cafe Lungo',
            value: 'cafe-lungo'
          },
          {
            label: 'Café Cubano',
            value: 'cafe-cubano'
          },
          {
            label: 'Caffè crema',
            value: 'caffe-crema'
          },
          {
            label: 'Cafe Zorro',
            value: 'cafe-zorro'
          },
          {
            label: 'Doppio',
            value: 'doppio'
          },
          {
            label: 'Espresso Romano',
            value: 'espresso-romano'
          },
          {
            label: 'Guillermo',
            value: 'guillermo'
          },
          {
            label: 'Ristretto',
            value: 'ristretto'
          }
        ]
      },
      {
        label: 'Milk coffee',
        value: 'milk-coffee',
        children: [
          {
            label: 'Flat white',
            value: 'flat-white'
          },
          {
            label: 'Latte',
            value: 'latte',
            disabled: true,
            children: [
              {
                label: 'Red Latte',
                value: 'red-latte'
              },
              {
                label: 'Green Latte',
                value: 'green-latte'
              }
            ]
          },
          {
            label: 'Macchiato',
            value: 'macchiato'
          },
          {
            label: 'Cappuccino',
            value: 'cappuccino'
          },
          {
            label: 'White coffee',
            value: 'white-coffee'
          }
        ]
      }
    ]

    let oneDepth = [
      {
        value: '1',
        label: '张三'
      },
      {
        value: '2',
        label: '李四'
      },
      {
        value: '3',
        label: '王五'
      }
    ]
    return {
      treeDatasource1: cloneDeep(coffees),
      treeDatasource2: cloneDeep(coffees),
      expanded1: ['10000', '1000'],

      selected1: [],
      datasource1: cloneDeep(coffees),

      selected2: [],
      datasource2: cloneDeep(oneDepth),

      selected3: [],
      datasource3: cloneDeep(coffees),

      selected4: [],
      datasource4: cloneDeep(oneDepth),

      selected5: ['flat-white'],
      datasource5: cloneDeep(coffees),

      datasource6: cloneDeep(coffees),
      formData: {
        selected6: ['ristretto']
      },

      validators: [
        {
          fields: ['selected6'],
          handler (selected6) {
            if (!selected6 || !selected6.length) {
              return {
                selected6: '请选择地域'
              }
            }
            return true
          }
        }
      ]
    }
  },
  computed: {
    datasource1LeafCount () {
      return this.countLeaves(this.datasource1)
    }
  },
  methods: {
    countLeaves (tree) {
      let count = 0
      let walk = tree => {
        tree.forEach(item => {
          if (!item.children) {
            count += 1
          } else {
            walk(item.children)
          }
        })
      }
      walk(tree)
      return count
    }
  }
}
</script>

<style lang="less" scoped>
.veui-transfer-demo {
  .operation {
    padding-left: 120px;
    margin-bottom: 100px;
  }

  .veui-select-panel-demo1 {
    .veui-tree {
      padding: 0 20px;
    }
  }
}
</style>
