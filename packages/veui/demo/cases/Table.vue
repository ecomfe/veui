<template>
  <article>
    <h1><code>&lt;veui-table&gt;</code></h1>
    <section>
      <veui-button ui="primary" @click="append">添加</veui-button>
    </section>
    <section>
      <veui-checkbox v-model="showGroup">显示数据分组</veui-checkbox>
    </section>
    <section>
      <veui-checkbox v-model="selectSpanRow">选择合并行</veui-checkbox>
    </section>
    <section>
      <veui-checkboxgroup type="checkbox" v-model="columns" :items="[
        { value: 'typeId', label: '类型 ID'},
        { value: 'id', label: '数据 ID'},
        { value: 'group', label: '数据分组'},
        { value: 'desc', label: '数据描述'},
        { value: 'price', label: '价格'},
        { value: 'updateDate', label: '更新时间'},
        { value: 'operation', label: '操作'}
      ]"/>
    </section>
    <section>
      <veui-table ui="alt bordered custom" scroll="150" :data="data" :column-filter="columns" :key-field="selectSpanRow ? 'group' : 'id'" selectable
        :order-by="orderBy" :order="order" @select="handleSelect" @sort="handleSort" :selected.sync="selected1">
        <veui-table-column field="id" title="数据 ID" sortable>
          <template slot="head"><strong>数据 <span style="color: #3998fc">ID</span></strong></template>
          <template slot="foot"><strong>总计</strong></template>
        </veui-table-column>
        <veui-table-column field="typeId" title="类型 ID" :span="typeSpan"/>
        <veui-table-column v-if="showGroup" field="group" title="数据分组" :span="groupSpan">
        </veui-table-column>
        <veui-table-column field="desc" title="数据描述"/>
        <veui-table-column field="price" title="价格" sortable width="160" align="right">
          <template slot-scope="props">{{ props.item.price | currency }}</template>
          <template slot="foot"><strong>{{ total | currency }}</strong></template>
        </veui-table-column>
        <veui-table-column field="updateDate" title="更新时间" align="center">
          <template slot-scope="props">
            <span :ref="`time-a-${props.item.id}`">{{ props.item.updateDate | date }}</span>
            <veui-tooltip :target="`time-a-${props.item.id}`">{{ props.item.updateDate | time }}</veui-tooltip>
          </template>
        </veui-table-column>
        <veui-table-column field="operation" title="操作">
          <template slot-scope="props">
            <veui-button ui="link" @click="log(props.item)">编辑</veui-button>
            <veui-button ui="link alert" @click="del(props.index)">删除</veui-button>
          </template>
        </veui-table-column>
      </veui-table>
      <p>已选ID：{{ JSON.stringify(selected1) }}</p>
    </section>
    <section class="container">
      <veui-table ui="slim bordered" :data="data" :column-filter="columns" :key-field="selectSpanRow ? 'group' : 'id'"
        selectable select-mode="single" :selected.sync="selected2">
        <veui-table-column field="id" title="数据 ID"/>
        <veui-table-column v-if="showGroup" field="group" title="数据分组" :span="groupSpan">
        </veui-table-column>
        <veui-table-column field="desc" title="数据描述"/>
        <veui-table-column field="price" title="价格" width="160" align="right">
          <template slot-scope="props">{{ props.item.price | currency }}</template>
        </veui-table-column>
        <veui-table-column field="updateDate" title="更新时间" align="right">
          <template slot-scope="props">
            <span :ref="`time-b-${props.item.id}`">{{ props.item.updateDate | date }}</span>
            <veui-tooltip :target="`time-b-${props.item.id}`">{{ props.item.updateDate | time }}</veui-tooltip>
          </template>
        </veui-table-column>
        <!-- <template slot="foot">An awesome table foot!</template> -->
      </veui-table>
      <p>已选ID：{{ JSON.stringify(selected2) }}</p>
    </section>
    <section class="container">
      <veui-table :data="data" :column-filter="columns" key-field="id" selectable expandable>
        <veui-table-column field="id" title="数据 ID"/>
        <veui-table-column field="desc" title="数据描述"/>
        <veui-table-column field="price" title="价格" width="160" align="right">
          <template slot-scope="props">{{ props.item.price | currency }}</template>
        </veui-table-column>
        <veui-table-column field="updateDate" title="更新时间" align="right">
          <template slot-scope="props">
            <span :ref="`time-b-${props.item.id}`">{{ props.item.updateDate | date }}</span>
            <veui-tooltip :target="`time-b-${props.item.id}`">{{ props.item.updateDate | time }}</veui-tooltip>
          </template>
        </veui-table-column>
        <template slot="sub-row" slot-scope="{ desc }">{{ desc }}</template>
      </veui-table>
    </section>
    <section class="container">
      <veui-table :data="data" :column-filter="columns" key-field="id" expandable>
        <veui-table-column field="id" title="数据 ID">
          <template slot="sub-row" slot-scope="{ id }">
            <em>{{ id }}</em>
          </template>
        </veui-table-column>
        <veui-table-column field="desc" title="数据描述"/>
        <veui-table-column field="price" title="价格" width="160" align="right">
          <template slot-scope="props">{{ props.item.price | currency }}</template>
        </veui-table-column>
        <veui-table-column field="updateDate" title="更新时间" align="right">
          <template slot-scope="props">
            <span :ref="`time-b-${props.item.id}`">{{ props.item.updateDate | date }}</span>
            <veui-tooltip :target="`time-b-${props.item.id}`">{{ props.item.updateDate | time }}</veui-tooltip>
          </template>
        </veui-table-column>
        <template slot="foot">An awesome table foot!</template>
      </veui-table>
    </section>
  </article>
</template>

<script>
import moment from 'moment'
import bus from '../bus'
import { Button, Checkbox, CheckboxGroup, Table, Column, Tooltip } from 'veui'

export default {
  name: 'table-demo',
  components: {
    'veui-button': Button,
    'veui-table': Table,
    'veui-table-column': Column,
    'veui-tooltip': Tooltip,
    'veui-checkbox': Checkbox,
    'veui-checkboxgroup': CheckboxGroup
  },
  filters: {
    currency (value) {
      return '¥' + value.toFixed(2)
    },
    date (value) {
      return moment(value).format('YYYY-MM-DD')
    },
    time (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data () {
    return {
      showGroup: true,
      selectSpanRow: true,
      data: [
        {
          id: '3154',
          desc: '数据描述1',
          price: 1024,
          updateDate: '20131117',
          group: '1577',
          typeId: '788',
          children: [
            {
              id: '31541', desc: '数据描述1-1', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            },
            {
              id: '31542', desc: '数据描述1-2', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            }
          ]
        },
        {
          id: '3155',
          desc: '数据描述2',
          price: 598,
          updateDate: '20140214',
          group: '1577',
          typeId: '788',
          children: [
            {
              id: '31551', desc: '数据描述2-1', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            },
            {
              id: '31552', desc: '数据描述2-2', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            }
          ]
        },
        {
          id: '3156',
          desc: '数据描述3',
          price: 820,
          updateDate: '20170610',
          group: '1578',
          typeId: '788',
          children: [
            {
              id: '31561', desc: '数据描述3-1', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            },
            {
              id: '31562', desc: '数据描述3-2', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            }
          ]
        },
        {
          id: '3157',
          desc: '数据描述4',
          price: 736,
          updateDate: '20180109',
          group: '1578',
          typeId: '788',
          children: [
            {
              id: '31571', desc: '数据描述4-1', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            },
            {
              id: '31572', desc: '数据描述4-2', price: 1024, updateDate: '20131117', group: '1577', typeId: '788'
            }
          ]
        }
      ],
      nextId: 3158,
      nextIndex: 4,
      columns: ['typeId', 'id', 'group', 'desc', 'price', 'updateDate', 'operation'],
      order: false,
      orderBy: null,
      selected1: ['3155', '3156'],
      selected2: '3156',
      groupSpan (i) {
        return {
          row: i % 2 ? 0 : 2
        }
      },
      typeSpan (i) {
        return {
          row: i % 4 ? 0 : 4
        }
      }
    }
  },
  computed: {
    total () {
      return this.data.reduce((total, item) => {
        return total + item.price
      }, 0)
    }
  },
  methods: {
    log (...args) {
      bus.$emit('log', ...args)
    },
    del (index) {
      this.log(this.data.splice(index, 1)[0])
    },
    append () {
      let item = {
        id: String(this.nextId),
        typeId: String(Math.floor(this.nextId / 4)),
        group: String(Math.floor(this.nextId / 2)),
        desc: `数据描述${this.nextIndex}`,
        price: Math.floor(Math.random() * 1280),
        updateDate: moment(Date.now() + Math.floor(Math.random() * 1e10)).format('YYYYMMDD')
      }
      this.nextId++
      this.nextIndex++
      this.data.push(item)
      this.log(item)
    },
    handleSelect (...args) {
      this.log(...args)
    },
    handleSort (orderBy, order) {
      this.orderBy = orderBy
      this.order = order
    }
  },
  mounted () {
    // for (let i = 0; i < 300; i++) {
    //   this.append()
    // }
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

.veui-table {
  margin-bottom: 30px;

  tfoot strong {
    font-size: 14px;
    font-weight: 400;
  }
}

.container {
  width: 640px;
}
</style>
