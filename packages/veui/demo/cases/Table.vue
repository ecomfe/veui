<template>
<article>
  <h1>
    <code>&lt;veui-table&gt;</code>
  </h1>
  <section>
    <veui-button
      ui="primary"
      @click="append"
    >
      添加
    </veui-button>
    <veui-button @click="toggle">切换数据</veui-button>
    <veui-button @click="toggleLoading">切换加载</veui-button>
  </section>
  <section>
    <veui-checkbox v-model="showGroup">显示数据分组</veui-checkbox>
  </section>
  <section>
    <veui-checkbox v-model="selectSpanRow">选择合并行</veui-checkbox>
  </section>
  <section>
    <veui-checkboxgroup
      v-model="columns"
      type="checkbox"
      :items="[
        { value: 'typeId', label: '类型 ID' },
        { value: 'id', label: '数据 ID' },
        { value: 'group', label: '数据分组' },
        { value: 'desc', label: '数据描述' },
        { value: 'price', label: '价格' },
        { value: 'updateDate', label: '更新时间' },
        { value: 'operation', label: '操作' }
      ]"
    />
  </section>
  <section>
    <veui-table
      ui="s compact"
      :scroll="{
        x: 1280,
        y: 300
      }"
      :data="data"
      :column-filter="columns"
      :key-field="selectSpanRow ? 'group' : 'id'"
      selectable
      :order-by="orderBy"
      :order="order"
      :selected.sync="selected1"
      :loading="loading"
      @select="handleSelect"
      @sort="handleSort"
    >
      <veui-table-column
        field="id"
        title="数据 ID"
        sortable
        fixed
      >
        <template slot="head">
          <strong>
            数据
            <span style="color: #3998fc">ID</span>
          </strong>
        </template>
        <template slot="foot">
          <strong>总计</strong>
        </template>
      </veui-table-column>
      <veui-table-column
        title="元数据"
        :desc="popover"
      >
        <veui-table-column
          field="typeId"
          title="类型 ID"
          :span="typeSpan"
        />
        <veui-table-column
          v-if="showGroup"
          field="group"
          title="数据分组"
          align="right"
          :span="groupSpan"
        />
      </veui-table-column>
      <veui-table-column
        field="desc"
        title="数据描述"
      />
      <veui-table-column
        field="price"
        sortable
        width="160"
        align="right"
        fixed
        desc="这是一条带有 slot-scope 的提示"
      >
        <template slot="head">
          价格
          <i>(每 1000g)</i>
        </template>
        <template slot-scope="props">{{
          props.item.price | currency
        }}</template>
        <template slot="foot">
          <strong>{{ total | currency }}</strong>
        </template>
      </veui-table-column>
      <veui-table-column
        field="updateDate"
        title="更新时间"
        align="center"
      >
        <template slot-scope="props">
          <span :ref="`time-a-${props.item.id}`">{{
            props.item.updateDate | date
          }}</span>
          <veui-tooltip :target="`time-a-${props.item.id}`">{{
            props.item.updateDate | time
          }}</veui-tooltip>
        </template>
      </veui-table-column>
      <veui-table-column
        field="operation"
        title="操作"
        fixed="right"
        width="160"
      >
        <template slot-scope="props">
          <veui-button
            ui="text"
            @click="log(props.item)"
          >编辑</veui-button>
          <veui-button
            ui="text"
            @click="del(props.index)"
          >删除</veui-button>
          <veui-link
            ui="strong"
            to="table"
          >查看</veui-link>
        </template>
      </veui-table-column>
    </veui-table>
    <p>已选ID：{{ JSON.stringify(selected1) }}</p>
  </section>
  <section class="container">
    <veui-table
      ui="loose"
      :data="data"
      :column-filter="columns"
      :key-field="selectSpanRow ? 'group' : 'id'"
      selectable
      select-mode="single"
      :selected.sync="selected2"
      :loading="loading"
    >
      <veui-table-column title="元数据">
        <veui-table-column
          field="id"
          title="数据 ID"
        />
        <veui-table-column
          v-if="showGroup"
          field="group"
          title="数据分组"
          :span="groupSpan"
        />
        <veui-table-column
          field="desc"
          title="数据描述"
        />
      </veui-table-column>
      <veui-table-column
        field="price"
        title="价格"
        width="160"
        align="right"
      >
        <template slot-scope="props">{{
          props.item.price | currency
        }}</template>
      </veui-table-column>
      <veui-table-column
        field="updateDate"
        title="更新时间"
        align="right"
      >
        <template slot-scope="props">
          <span :ref="`time-b-${props.item.id}`">{{
            props.item.updateDate | date
          }}</span>
          <veui-tooltip :target="`time-b-${props.item.id}`">{{
            props.item.updateDate | time
          }}</veui-tooltip>
        </template>
      </veui-table-column>
    </veui-table>
    <p>已选ID：{{ JSON.stringify(selected2) }}</p>
  </section>
  <section class="container">
    <veui-table
      :data="data"
      key-field="id"
      selectable
      expandable
      :scroll="{ x: 1024 }"
      :loading="loading"
    >
      <veui-table-column
        field="id"
        title="数据 ID"
      />
      <veui-table-column
        field="desc"
        title="数据描述"
      />
      <veui-table-column
        field="price"
        title="价格"
        width="160"
        align="right"
      >
        <template slot-scope="props">{{
          props.item.price | currency
        }}</template>
      </veui-table-column>
      <veui-table-column
        field="updateDate"
        title="更新时间"
        align="right"
      >
        <template slot-scope="props">
          <span :ref="`time-b-${props.item.id}`">{{
            props.item.updateDate | date
          }}</span>
          <veui-tooltip :target="`time-b-${props.item.id}`">{{
            props.item.updateDate | time
          }}</veui-tooltip>
        </template>
      </veui-table-column>
      <template
        slot="sub-row"
        slot-scope="{ desc }"
      >{{ desc }}</template>
    </veui-table>
  </section>
  <section class="container">
    <veui-table
      :data="data"
      key-field="id"
      expandable
      :scroll="{ x: 1200 }"
      :loading="loading"
    >
      <veui-table-column
        field="id"
        title="数据 ID"
      >
        <template
          slot="sub-row"
          slot-scope="{ id }"
        >
          <em>{{ id }}</em>
        </template>
      </veui-table-column>
      <veui-table-column
        field="desc"
        title="数据描述"
      />
      <veui-table-column
        field="price"
        title="价格"
        width="160"
        align="right"
      >
        <template slot-scope="props">{{
          props.item.price | currency
        }}</template>
      </veui-table-column>
      <veui-table-column
        field="updateDate"
        title="更新时间"
        align="right"
      >
        <template slot-scope="props">
          <span :ref="`time-b-${props.item.id}`">{{
            props.item.updateDate | date
          }}</span>
          <veui-tooltip :target="`time-b-${props.item.id}`">{{
            props.item.updateDate | time
          }}</veui-tooltip>
        </template>
      </veui-table-column>
      <template slot="foot">An awesome table foot!</template>
    </veui-table>
  </section>
  <section class="container">
    <section>
      <veui-input
        v-model="idTitle"
        placeholder="列标题"
      />
    </section>
    <veui-table
      :data="data"
      key-field="id"
      :loading="loading"
    >
      <veui-table-column
        field="id"
        title="数据 ID"
      >
        <template slot="head">{{ idTitle }}</template>
      </veui-table-column>
      <veui-table-column
        field="desc"
        title="数据描述"
      />
      <veui-table-column
        field="price"
        title="价格"
        width="160"
        align="right"
      >
        <template slot-scope="props">{{
          props.item.price | currency
        }}</template>
      </veui-table-column>
      <veui-table-column
        field="updateDate"
        title="更新时间"
        align="right"
      >
        <template slot-scope="props">
          {{ props.item.updateDate | date }}
        </template>
      </veui-table-column>
      <template slot="foot">An awesome table foot!</template>
    </veui-table>
  </section>
  <section class="container">
    <veui-table
      key-field="id"
      :data="data"
      :loading="loading"
    >
      <veui-table-column
        v-for="field in fields"
        :key="field.name"
        :field="field.name"
        :title="field.title"
      />
    </veui-table>
  </section>
  <section class="container">
    <veui-table
      :data="items"
      :scroll="{ x: 1200 }"
      :loading="loading"
    >
      <veui-table-column
        fixed="right"
        title="meta"
      >
        <veui-table-column
          field="id"
          title="id"
        />
        <veui-table-column
          field="type"
          title="type"
        />
      </veui-table-column>
      <veui-table-column
        fixed
        field="name"
        title="name"
      />
      <veui-table-column
        fixed="left"
        field="origin"
        title="origin"
      />
      <veui-table-column
        field="level"
        title="level"
      />
    </veui-table>
  </section>
  <section class="container">
    <h3>Orders: {{ allowedOrders1 }} , Current: {{ order1 }}</h3>
    <veui-table
      key-field="id"
      :data="items"
      :order="order1"
      :order-by="orderBy1"
      :allowed-orders="allowedOrders1"
      @sort="
        (orderBy, order) => {
          orderBy1 = orderBy
          order1 = order
        }
      "
    >
      <veui-table-column
        field="id"
        title="id"
        sortable
      />
    </veui-table>
    <h3>Orders: {{ allowedOrders2 }} , Current: {{ order2 }}</h3>
    <veui-button @click="switchDisabled">切换disabled</veui-button>
    <veui-button @click="switchAll">切换all</veui-button>
    <veui-table
      key-field="id"
      :data="items"
      selectable
      :order="order2"
      order-by="id"
      :allowed-orders="allowedOrders2"
      @sort="(_, order) => (order2 = order)"
    >
      <veui-table-column
        field="id"
        title="id"
        sortable
      />
    </veui-table>
  </section>
</article>
</template>

<script>
import moment from 'moment'
import bus from '../bus'
import {
  Button,
  Input,
  Checkbox,
  CheckboxGroup,
  Table,
  Column,
  Tooltip,
  Link
} from 'veui'

const tableData = [
  {
    id: '3154',
    desc: '数据描述1',
    price: 1024,
    updateDate: '20131117',
    group: '1577',
    typeId: '788',
    children: [
      {
        id: '31541',
        desc: '数据描述1-1',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
      },
      {
        id: '31542',
        desc: '数据描述1-2',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
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
        id: '31551',
        desc: '数据描述2-1',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
      },
      {
        id: '31552',
        desc: '数据描述2-2',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
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
        id: '31561',
        desc: '数据描述3-1',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
      },
      {
        id: '31562',
        desc: '数据描述3-2',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
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
        id: '31571',
        desc: '数据描述4-1',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
      },
      {
        id: '31572',
        desc: '数据描述4-2',
        price: 1024,
        updateDate: '20131117',
        group: '1577',
        typeId: '788'
      }
    ]
  },
  {
    id: '3158',
    desc: '数据描述5',
    price: 168,
    updateDate: '20180109',
    group: '1579',
    typeId: '789'
  },
  {
    id: '3159',
    desc: '数据描述6',
    price: 820,
    updateDate: '20180109',
    group: '1579',
    typeId: '789'
  },
  {
    id: '3160',
    desc: '数据描述7',
    price: 357,
    updateDate: '20180109',
    group: '1580',
    typeId: '789'
  },
  {
    id: '3161',
    desc: '数据描述8',
    price: 360,
    updateDate: '20180109',
    group: '1580',
    typeId: '789',
    children: [
      {
        id: '31611',
        desc: '数据描述8-1',
        price: 1024,
        updateDate: '20131117',
        group: '1580',
        typeId: '789'
      }
    ]
  }
]

export default {
  name: 'table-demo',
  components: {
    'veui-button': Button,
    'veui-table': Table,
    'veui-table-column': Column,
    'veui-tooltip': Tooltip,
    'veui-checkbox': Checkbox,
    'veui-input': Input,
    'veui-link': Link,
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
      s: false,
      idTitle: '#',
      showGroup: true,
      selectSpanRow: true,
      fields: [
        { name: 'id', title: 'ID' },
        { name: 'desc', title: '描述' }
      ],
      allowedOrders1: ['asc', 'desc'],
      allowedOrders2: [false, 'asc', 'desc'],
      order1: 'desc',
      order2: false,
      orderBy1: 'id2',
      data: [],
      nextId: 3162,
      nextIndex: 9,
      columns: [
        'typeId',
        'id',
        'group',
        'desc',
        'price',
        'updateDate',
        'operation'
      ],
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
      },
      items: [
        {
          id: 1,
          type: 'fruits',
          name: 'apple',
          origin: 'Japan',
          level: 'A'
        },
        {
          id: 2,
          type: 'fruits',
          name: 'cherry',
          origin: 'Chile',
          level: 'A'
        },
        {
          id: 3,
          type: 'veggie',
          name: 'tomato',
          origin: 'China',
          level: 'A'
        },
        {
          id: 4,
          type: 'veggie',
          name: 'potato',
          origin: 'China',
          level: 'A'
        }
      ],
      loading: false,
      popover: '这是一条补充的 Popover 信息'
    }
  },
  computed: {
    total () {
      return this.data.reduce((total, item) => {
        return total + item.price
      }, 0)
    }
  },
  watch: {
    idTitle () {
      this.s = true
      this.$nextTick(() => {
        this.s = false
      })
    }
  },
  mounted () {
    // for (let i = 0; i < 300; i++) {
    //   this.append()
    // }
  },
  methods: {
    toggle () {
      this.data = this.data === tableData ? [] : tableData
    },
    switchDisabled () {
      let first = this.items[0]
      this.items = [
        {
          ...first,
          disabled: !first.disabled
        },
        ...this.items.slice(1)
      ]
    },
    switchAll () {
      this.items = this.items.map(i => ({
        ...i,
        disabled: !i.disabled
      }))
    },
    toggleLoading () {
      this.loading = !this.loading
    },
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
        updateDate: moment(
          Date.now() + Math.floor(Math.random() * 1e10)
        ).format('YYYYMMDD')
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
  }
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 20px;

  .veui-button + .veui-button {
    margin-left: 20px;
  }
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
