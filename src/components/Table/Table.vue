<template>
<table class="veui-table" :ui="ui">
  <colgroup><slot></slot></colgroup>
  <table-head :data="data" :columns="displayedColumns" :selectable="selectable" :select-status="selectStatus" @select="select"></table-head>
  <slot name="foot"><table-foot v-if="hasFoot" :data="data" :columns="displayedColumns"></table-foot></slot>
  <tbody v-if="!data.length">
    <tr><td class="veui-table-no-data" :colspan="displayedColumns.length"><slot name="no-data">没有数据</slot></td></tr>
  </tbody>
  <template v-else>
    <table-body :data="data" :columns="displayedColumns" :selectable="selectable"
      :selected-items="selectedItems" :keys="realKeys" @select="select"></table-body>
  </template>
</table>
</template>

<script>
import { map, zipObject, intersection, isString, isArray } from 'lodash'
import Body from './Body'
import Head from './Head'
import Foot from './Foot'

export default {
  name: 'veui-table',
  uiTypes: ['table'],
  components: {
    'table-body': Body,
    'table-head': Head,
    'table-foot': Foot
  },
  props: {
    ui: String,
    data: {
      type: Array,
      default () {
        return []
      }
    },
    keys: {
      validator (keys) {
        if (!keys) {
          return true
        }
        return isString(keys) || isArray(keys) && keys.length === this.data.length
      }
    },
    selectable: Boolean,
    columnFilter: Array
  },
  data () {
    return {
      columns: [],
      selectedItems: {}
    }
  },
  computed: {
    displayedColumns () {
      if (!this.columnFilter) {
        return this.columns
      }
      return this.columns.filter(col => this.columnFilter.indexOf(col.field) !== -1 || !col.field)
    },
    realKeys () {
      let keys = this.keys
      if (!keys) {
        keys = Object.keys(this.data)
      }
      if (typeof keys === 'string') {
        keys = map(this.data, keys)
      }
      return keys
    },
    selectStatus () {
      let keys = this.realKeys
      let selectedKeys = Object.keys(this.selectedItems)
      let inter = intersection(keys, selectedKeys)
      if (!inter.length) {
        return 'none'
      }
      if (inter.length === keys.length) {
        return 'all'
      }
      return 'partial'
    },
    hasFoot () {
      return this.$slots.foot || this.columns.some(col => col.hasFoot)
    }
  },
  methods: {
    select (selected, index) {
      if (index !== undefined) {
        let item = this.data[index]
        index = this.realKeys ? this.realKeys[index] : index
        if (selected) {
          this.$set(this.selectedItems, index, item)
        } else {
          this.$delete(this.selectedItems, index)
        }
        this.$emit('select', selected, item, this.selectedItems)
      } else {
        if (selected) {
          let items = zipObject(this.realKeys, this.data)
          this.selectedItems = {
            ...this.selectedItems,
            ...items
          }
        } else {
          this.selectedItems = {}
        }
        this.$emit('selectall', selected, this.selectedItems)
      }
      this.$emit('change', this.selectedItems)
    }
  }
}
</script>

<style lang="less">
@import "../../styles/theme-default/lib.less";

.veui-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 20px;
    color: @veui-gray-color-normal;
    text-align: left;
    white-space: nowrap;
    line-height: 1;
  }

  th {
    font-weight: @veui-font-weight-bold;
  }

  td {
    border: 1px solid @veui-gray-color-sup-2;
    border-style: solid none;
  }

  tr:last-child {
    & > th,
    & > td {
      border-bottom: none;
    }
  }

  tfoot th {
    border-top: 1px solid @veui-gray-color-sup-2;
  }

  &[ui~="slim"] {
    th,
    td {
      .padding(17px, _);
    }
  }

  &[ui~="alt"] {
    thead th {
      color: @veui-text-color-weak;
    }

    thead,
    tfoot {
      background-color: @veui-gray-color-sup-4;
    }
  }

  .veui-table-no-data {
    text-align: center;
  }

  .veui-button + .veui-button {
    margin-left: 30px;
  }
}
</style>
