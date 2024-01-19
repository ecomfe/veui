<template>
<article>
  <h1>
    <code>&lt;veui-table&gt;</code>
  </h1>
  <section class="options">
    <veui-button
      class="button"
      ui="primary"
      @click="append"
    >添加</veui-button>
    <veui-button class="button" @click="toggle">切换数据</veui-button>
    <veui-button class="button" @click="toggleLoading">切换加载</veui-button>
    <veui-button
      class="button"
      @click="filtered = null"
    >清空筛选</veui-button>
  </section>
  <section class="options">
    <veui-label>
      内容固定行
      <veui-number-input
        v-model="lines"
        class="number-input"
        :disabled="linesAuto"
        :min="1"
        :max="2"
      />
    </veui-label>
    <veui-checkbox v-model="linesAuto">自适应</veui-checkbox>
    <veui-label>
      表头固定行
      <veui-number-input
        v-model="headLines"
        class="number-input"
        :disabled="headLinesAuto"
        :min="1"
        :max="2"
      />
    </veui-label>
    <veui-checkbox v-model="headLinesAuto">自适应</veui-checkbox>
  </section>
  <section class="options">
    <veui-checkbox v-model="selectable">可选择</veui-checkbox>
    <veui-checkbox v-model="showGroup">显示数据分组</veui-checkbox>
    <veui-checkbox v-model="selectSpanRow">选择合并行</veui-checkbox>
    <veui-checkbox v-model="scrollX">横向内部滚动</veui-checkbox>
    <veui-checkbox v-model="scrollY">纵向内部滚动</veui-checkbox>
    <veui-checkbox
      v-model="loadingOptions.type"
      true-value="spinner"
    >使用 spinner</veui-checkbox>
    <veui-checkbox
      v-model="loadingOptions.modal"
      :disabled="loadingOptions.type === 'spinner'"
    >loading 遮罩</veui-checkbox>
  </section>
  <section class="options">
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
  <section class="options">
    <veui-input v-model="foot"/>
  </section>
  <section>
    <veui-table
      class="table"
      ui="s compact crowded"
      :scroll="{
        x: scrollX ? 1280 : null,
        y: scrollY ? 300 : null
      }"
      :data="data"
      :column-filter="columns"
      :key-field="selectSpanRow ? 'group' : 'id'"
      :selectable="selectable"
      :order-by="orderBy"
      :order="order"
      :selected.sync="selected1"
      :loading="loading"
      :loading-options="loadingOptions"
      :style="style"
      @select="handleSelect"
      @sort="handleSort"
    >
      <veui-table-column field="id" title="数据 ID" sortable fixed width="80">
        <template #head>
          <strong>
            数据
            <span style="color: #3998fc">ID</span>
            很长很长很长很长很长很长很长很长很长很长很长很长很长很长
          </strong>
        </template>
        <template #foot>
          <strong>总计</strong>
        </template>
      </veui-table-column>
      <veui-table-column title="元数据" :desc="pop">
        <veui-table-column
          field="typeId"
          title="类型 ID"
          sortable
          :span="typeSpan"
        >
          <template #desc="{ close }">
            <p>一段说明文本……</p>
            <p>
              <veui-button class="button" @click="close">知道了</veui-button>
            </p>
          </template>
          <template #foot>
            {{ foot }}
          </template>
        </veui-table-column>
        <veui-table-column
          v-if="showGroup"
          field="group"
          title="数据分组很长很长很长很长很长很长很长很长很长很长很长很长很长很长"
          align="right"
          :span="groupSpan"
        />
      </veui-table-column>
      <veui-table-column
        field="desc"
        title="数据描述"
        :tooltip="({ desc }) => desc.substring(0, 30) + '...'"
      />
      <veui-table-column
        field="price"
        sortable
        width="200"
        align="right"
        fixed
        filter-multiple
        :filter-value.sync="filtered"
        :filter-options="[
          { label: '高', value: 'high' },
          { label: '中', value: 'mid' },
          { label: '低', value: 'low' },
          { label: '高1', value: 'high1' },
          { label: '中1', value: 'mid1' },
          { label: '低1', value: 'low1' },
          { label: '高2', value: 'high2' },
          { label: '中2', value: 'mid2' },
          { label: '低2', value: 'low2' }
        ]"
      >
        <!-- <template #filter="{ close }">
          <div style="padding: 0 12px">
            <h4 style="margin: 4px 0 8px">Filter</h4>
            <veui-checkbox
              v-model="filtered"
              @click="close"
            >优惠</veui-checkbox>
          </div>
          </template>-->
        <template #desc>这是一条带有 slot 的提示</template>
        <template #head>
          价格
          <i>(每 1000g)</i>
          <button>❤️</button>
        </template>
        <template slot-scope="props">
          {{ props.item.price | currency }}
        </template>
        <template #foot>
          <strong>{{ total | currency }}</strong>
        </template>
      </veui-table-column>
      <veui-table-column field="updateDate" title="更新时间" align="center">
        <template #default="{ updateDate }">
          <span v-tooltip="time(updateDate)">{{ updateDate | date }}</span>
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
            class="button"
            ui="text"
            @click="log(props.item)"
          >编辑</veui-button>
          <veui-button
            class="button"
            ui="text"
            @click="del(props.index)"
          >删除</veui-button>
          <veui-link ui="strong" to="table">查看</veui-link>
        </template>
      </veui-table-column>
    </veui-table>
    <p>已选ID：{{ JSON.stringify(selected1) }}</p>
  </section>
  <section class="container">
    <veui-table
      class="table"
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
        <veui-table-column field="id" title="数据 ID"/>
        <veui-table-column
          v-if="showGroup"
          field="group"
          title="数据分组"
          :span="groupSpan"
        />
        <veui-table-column
          field="desc"
          title="数据描述"
          :filter-value="inputFilterActive"
        >
          <template #filter>
            <veui-input v-model="inputFilter"/>
          </template>
        </veui-table-column>
      </veui-table-column>
      <veui-table-column
        field="price"
        title="价格"
        width="160"
        align="right"
        filter-multiple
        filter-title="价格区间"
        :filter-options="[
          { label: '高价格', value: 'high' },
          { label: '中价格', value: 'mid' },
          { label: '低价格', value: 'low' }
        ]"
      >
        <template slot-scope="props">
          {{ props.item.price | currency }}
        </template>
      </veui-table-column>
      <veui-table-column
        field="updateDate"
        title="更新时间"
        align="right"
        :filter-options="[
          { label: '全部', value: null },
          { label: '一周前', value: 'early' },
          { label: '一周内', value: 'late' }
        ]"
      >
        <template #default="{ updateDate }">
          <span v-tooltip="time(updateDate)">{{ updateDate | date }}</span>
        </template>
      </veui-table-column>
    </veui-table>
    <p>已选ID：{{ JSON.stringify(selected2) }}</p>
  </section>
  <section class="container">
    <veui-table
      class="table"
      :data="data"
      key-field="id"
      selectable
      expandable
      :scroll="{ x: 1024 }"
      :loading="loading"
    >
      <veui-table-column field="id" title="数据 ID"/>
      <veui-table-column field="desc" title="数据描述"/>
      <veui-table-column field="price" title="价格" width="160" align="right">
        <template slot-scope="props">
          {{ props.item.price | currency }}
        </template>
      </veui-table-column>
      <veui-table-column field="updateDate" title="更新时间" align="right">
        <template #default="{ updateDate }">
          <span v-tooltip="time(updateDate)">{{ updateDate | date }}</span>
        </template>
      </veui-table-column>
      <template #sub-row="{ desc }">{{ desc }}</template>
    </veui-table>
  </section>
  <section class="container">
    <veui-table
      class="table"
      :data="data"
      key-field="id"
      expandable
      :scroll="{ x: 1200 }"
      :loading="loading"
    >
      <veui-table-column field="id" title="数据 ID">
        <template #sub-row="{ id }">
          <em>{{ id }}</em>
        </template>
      </veui-table-column>
      <veui-table-column field="desc" title="数据描述"/>
      <veui-table-column field="price" title="价格" width="160" align="right">
        <template slot-scope="props">
          {{ props.item.price | currency }}
        </template>
      </veui-table-column>
      <veui-table-column field="updateDate" title="更新时间" align="right">
        <template #default="{ updateDate }">
          <span v-tooltip="time(updateDate)">{{ updateDate | date }}</span>
        </template>
      </veui-table-column>
      <template #foot>An awesome table foot!</template>
    </veui-table>
  </section>
  <section class="container">
    <section>
      <veui-input v-model="idTitle" placeholder="列标题"/>
    </section>
    <veui-table class="table" :data="data" key-field="id" :loading="loading">
      <veui-table-column field="id" title="数据 ID">
        <template #head>{{ idTitle }}</template>
      </veui-table-column>
      <veui-table-column field="desc" title="数据描述"/>
      <veui-table-column field="price" title="价格" width="160" align="right">
        <template slot-scope="props">
          {{ props.item.price | currency }}
        </template>
      </veui-table-column>
      <veui-table-column field="updateDate" title="更新时间" align="right">
        <template slot-scope="props">{{
          props.item.updateDate | date
        }}</template>
      </veui-table-column>
      <template #foot>An awesome table foot!</template>
    </veui-table>
  </section>
  <section class="container">
    <veui-table class="table" key-field="id" :data="data" :loading="loading">
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
      class="table"
      :data="items"
      :scroll="{ x: 1200 }"
      :loading="loading"
      :style="{ '--dls-table-sticky-scrollbar-bottom': '20px' }"
    >
      <veui-table-column fixed="right" title="meta">
        <veui-table-column field="id" :title="idTitle" width="120"/>
        <veui-table-column field="type" title="type" width="120"/>
      </veui-table-column>
      <veui-table-column fixed field="name" title="name" width="120"/>
      <veui-table-column
        fixed="left"
        field="origin"
        title="origin"
        width="120"
      />
      <veui-table-column field="level" title="level"/>
    </veui-table>
  </section>
  <section class="container">
    <h3>Orders: {{ allowedOrders1 }} , Current: {{ order1 }}</h3>
    <veui-table
      class="table"
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
      <veui-table-column field="id" title="id" sortable/>
    </veui-table>
    <h3>Orders: {{ allowedOrders2 }} , Current: {{ order2 }}</h3>
    <section class="options">
      <veui-button
        class="button"
        @click="switchDisabled"
      >切换disabled</veui-button>
      <veui-button class="button" @click="switchAll">切换all</veui-button>
    </section>
    <veui-table
      class="table"
      key-field="id"
      :data="items"
      selectable
      :order="order2"
      order-by="id"
      :allowed-orders="allowedOrders2"
      @sort="(_, order) => (order2 = order)"
    >
      <veui-table-column field="id" title="id" sortable/>
    </veui-table>

    <veui-table class="table" key-field="id" :data="items">
      <veui-table-column field="id" title="id" sortable/>
      <veui-table-column v-if="!toggled" field="type" title="type"/>
      <veui-table-column v-if="false" field="name" title="name"/>
      <veui-table-column
        v-if="toggled"
        key="origin"
        field="origin"
        title="origin"
      />
      <veui-table-column field="level" title="level"/>
    </veui-table>
    <section class="options">
      <veui-button
        class="button"
        @click="toggled = !toggled"
      >toggle type and origin</veui-button>
    </section>
    <veui-table class="table" key-field="id" :data="items">
      <template v-if="!toggled">
        <veui-table-column field="id" title="id1" sortable/>
        <veui-table-column field="type" title="type2"/>
      </template>
      <origin-and-level v-if="toggled"/>
      <veui-table-column field="name" title="name"/>
    </veui-table>
  </section>
  <section>
    <veui-table class="table" key-field="id" :data="data">
      <veui-table-column width="300" title="Head" field="id"/>
      <veui-table-column width="300" title="Head" field="desc"/>
      <veui-table-column width="300" title="Head" field="price"/>
      <veui-table-column width="300" title="Head" field="updateDate"/>
      <veui-table-column width="300" title="Head" field="group"/>
      <veui-table-column width="300" title="Head" field="typeId"/>
    </veui-table>
  </section>
  <section>
    <h5>列类型 group 变化</h5>
    <section class="options">
      <veui-button
        class="button"
        @click="exist = !exist"
      >切换第二列</veui-button>
      <veui-button
        class="button"
        @click="isGroup = !isGroup"
      >切换第二列类型</veui-button>
    </section>
    <veui-table class="table" :data="items" key-field="id">
      <veui-table-column field="id" title="Id"/>
      <veui-table-column
        v-if="exist"
        field="operation"
        title="第二列"
        :group="isGroup"
      >
        <template #default>
          <veui-table-column v-if="isGroup" field="op1" title="Op1"/>
          <veui-table-column v-if="isGroup" field="op2" title="Op2"/>
          <div v-if="!isGroup">1</div>
        </template>
      </veui-table-column>
    </veui-table>
  </section>
  <section>
    <h5>列 scopedSlots 动态变化</h5>
    <section class="options">
      <veui-button
        class="button"
        @click="swNo ^= 1"
      >switch(OP{{ swNo }})</veui-button>
    </section>
    <veui-table class="table" :data="items" key-field="id">
      <veui-table-column field="operation" title="Operations">
        <template v-if="swNo" #default="{ index }">
          <veui-button class="button" ui="text">OP1:{{ index }}</veui-button>
        </template>

        <template v-else #default="{ index }">
          <veui-button class="button" ui="text">OP0:{{ index }}</veui-button>
        </template>
      </veui-table-column>
    </veui-table>
  </section>
  <section>
    <h5>动态切换 column-filter</h5>
    <div class="options">
      <veui-button
        class="button"
        @click="toggleFilter"
      >切换列过滤</veui-button>
    </div>
    <veui-table
      :data="tableData"
      key-field="id"
      selectable
      :column-filter="tableColumns"
      style="width: 800px"
    >
      <veui-table-column
        key="id"
        field="id"
        title="ID"
        fixed="left"
        width="180"
      />
      <veui-table-column key="name" field="name" title="Name" width="180"/>
      <veui-table-column
        key="title"
        field="title"
        title="title"
        width="180"
      />
      <veui-table-column key="text" field="text" title="text" width="180"/>
      <veui-table-column
        field="desc"
        title="Description"
        tooltip
        fixed="right"
        width="180"
      />
    </veui-table>
  </section>
</article>
</template>

<script>
import format from 'date-fns/format'
import bus from '../bus'
import {
  Button,
  Input,
  Checkbox,
  CheckboxGroup,
  Table,
  Column,
  Link,
  NumberInput,
  Label
} from 'veui'
import { tooltip } from 'veui/directives'

const tableData = [
  {
    id: '3154',
    desc: '数据描述1-Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolores culpa ipsa alias pariatur cumque libero in earum vel vitae officia ullam, eum consequuntur perferendis! Optio maxime error qui veritatis!',
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
    desc: '数据描述3-Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolores culpa ipsa alias pariatur cumque libero in earum vel vitae officia ullam, eum consequuntur perferendis! Optio maxime error qui veritatis!',
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
    desc: '数据描述4-Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolores culpa ipsa alias pariatur cumque libero in earum vel vitae officia ullam, eum consequuntur perferendis! Optio maxime error qui veritatis!',
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

function currency (value) {
  return '¥' + value.toFixed(2)
}

function time (value) {
  const date = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
}

function date (value) {
  return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
}

const long =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, quibusdam! Pariatur, laboriosam? Voluptatibus, sunt.'
const short = 'Lorem ipsum.'

export default {
  name: 'table-demo',
  components: {
    'veui-button': Button,
    'veui-table': Table,
    'veui-table-column': Column,
    'veui-checkbox': Checkbox,
    'veui-input': Input,
    'veui-link': Link,
    'veui-checkboxgroup': CheckboxGroup,
    'veui-number-input': NumberInput,
    'veui-label': Label,
    OriginAndLevel: {
      render () {
        // 先支持这种写法吧
        return (
          <div>
            <Column field="origin" title="origin3" />
            <Column field="level" title="level4" />
          </div>
        )
      }
    }
  },
  directives: {
    tooltip
  },
  filters: {
    currency,
    date,
    time
  },
  data () {
    return {
      foot: 'foot',
      filtered: null,
      s: false,
      swNo: 0,
      isGroup: false,
      exist: false,
      toggled: false,
      selectable: true,
      scrollX: true,
      scrollY: true,
      loadingOptions: {
        type: 'default',
        modal: true
      },
      idTitle: '#',
      showGroup: true,
      selectSpanRow: true,
      lines: 1,
      linesAuto: false,
      headLines: 1,
      headLinesAuto: false,
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
      popover: '这是一条补充的 Popover 信息',
      inputFilter: '',
      count: 0,
      tick: null,
      tableColumns: ['id', 'desc'],
      tableData: [
        {
          id: '3154',
          name: 'Steve Rogers',
          desc: long
        },
        {
          id: '3155',
          name: 'Thor Odinson',
          desc: short
        },
        {
          id: '3156',
          name: 'Tony Stark',
          desc: short
        },
        {
          id: '3157',
          name: 'Stephen Strange',
          desc: long
        }
      ]
    }
  },
  computed: {
    pop () {
      return `${this.popover}：${this.count}`
    },
    total () {
      return this.data.reduce((total, item) => {
        return total + item.price
      }, 0)
    },
    inputFilterActive () {
      return this.inputFilter === '' ? null : true
    },
    style () {
      return {
        '--dls-table-cell-lines': this.linesAuto ? 'auto' : this.lines,
        '--dls-table-head-cell-lines': this.headLinesAuto
          ? 'auto'
          : this.headLines
      }
    }
  },
  mounted () {
    // for (let i = 0; i < 300; i++) {
    //   this.append()
    // }
    // this.tick = setInterval(() => {
    //   this.count += 1
    // }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.tick)
  },
  methods: {
    currency,
    date,
    time,
    toggle () {
      this.data = this.data === tableData ? [] : tableData
    },
    toggleFilter () {
      this.tableColumns = ['id', 'desc', 'name', 'title', 'text']
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
      this.items = this.items.map((i) => ({
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
        updateDate: format(
          Date.now() + Math.floor(Math.random() * 1e10),
          'yyyyMMdd'
        )
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

  .button + .button {
    margin-left: 20px;
  }

  &.options {
    display: flex;
    align-content: center;
  }
}

.number-input {
  margin-left: 8px;
}

label {
  margin-right: 10px;
}

.table {
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
