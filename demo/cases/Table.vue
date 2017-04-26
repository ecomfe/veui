<template>
  <article>
    <h1><code>&lt;veui-table&gt;</code></h1>
    <section>
      <veui-button ui="primary" @click="append">添加</veui-button>
    </section>
    <section>
      <veui-table ui="slim alt" :data="data" :columnFilter="columns" keys="id" selectable
        :order-by="orderBy" :order="order" @select="handleSelect" @sort="handleSort">
        <veui-table-column field="id" title="数据 ID" sortable></veui-table-column>
        <veui-table-column field="desc" title="数据描述"></veui-table-column>
        <veui-table-column field="price" title="价格" sortable width="160">
          <template scope="props">{{ '¥' + props.item.price.toFixed(2) }}</template>
        </veui-table-column>
        <veui-table-column field="updateDate" title="更新时间">
          <template scope="props">{{ props.item.updateDate | date }}</template>
        </veui-table-column>
        <veui-table-column field="operation" title="操作">
          <template scope="props">
            <veui-button ui="link" @click="log(props.item)">编辑</veui-button>
            <veui-button ui="link alert" @click="del(props.index)">删除</veui-button>
          </template>
        </veui-table-column>
      </veui-table>
    </section>
    <section>
      <label><input type="checkbox" value="id" v-model="columns"> ID</label>
      <label><input type="checkbox" value="desc" v-model="columns"> 描述</label>
      <label><input type="checkbox" value="price" v-model="columns"> 价格</label>
      <label><input type="checkbox" value="updateDate" v-model="columns"> 更新时间</label>
      <label><input type="checkbox" value="operation" v-model="columns"> 操作</label>
    </section>
  </article>
</template>

<script>
import moment from 'moment'
import bus from '../bus'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Column from '@/components/Table/Column'

export default {
  name: 'table',
  components: {
    'veui-button': Button,
    'veui-table': Table,
    'veui-table-column': Column
  },
  filters: {
    date (value) {
      return moment(value).format('YYYY-MM-DD')
    }
  },
  data () {
    return {
      data: [
        {
          id: '3154', desc: '数据描述1', price: 1024, updateDate: '20131117'
        },
        {
          id: '3155', desc: '数据描述2', price: 598, updateDate: '20140214'
        },
        {
          id: '3156', desc: '数据描述3', price: 820, updateDate: '20170610'
        }
      ],
      nextId: 3157,
      nextIndex: 4,
      columns: ['id', 'desc', 'price', 'updateDate', 'operation'],
      order: false,
      orderBy: null
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
        id: this.nextId,
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
</style>
