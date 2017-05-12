<template>
<table class="veui-table" :ui="ui">
  <colgroup>
    <col v-if="selectable" width="60"></col>
    <col v-for="col in displayedColumns" :width="col.width"></col>
  </colgroup>
  <table-head :data="data" :columns="displayedColumns" :selectable="selectable" :select-status="selectStatus" @select="select" @sort="sort"></table-head>
  <slot name="foot"><table-foot v-if="hasFoot" :data="data" :columns="displayedColumns"></table-foot></slot>
  <tbody v-if="!data.length">
    <tr><td class="veui-table-no-data" :colspan="(selectable ? 1 : 0) + displayedColumns.length"><slot name="no-data">没有数据</slot></td></tr>
  </tbody>
  <template v-else>
    <table-body :data="data" :columns="displayedColumns" :selectable="selectable"
      :selected-items="selectedItems" :keys="realKeys" @select="select"></table-body>
  </template>
  <slot></slot>
</table>
</template>

<script>
import { map, intersection, isString, isArray, includes, indexOf } from 'lodash'
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
      validator (value) {
        if (!value) {
          return true
        }
        return isString(value) || isArray(value) && value.length === this.data.length
      }
    },
    selectable: Boolean,
    order: [String, Boolean],
    orderBy: String,
    columnFilter: Array,
    selected: Array
  },
  data () {
    return {
      columns: [],
      localSelectedKeys: this.selected || []
    }
  },
  computed: {
    displayedColumns () {
      if (!this.columnFilter) {
        return this.columns
      }
      return this.columns.filter(col => includes(this.columnFilter, col.field))
    },
    realKeys () {
      let keys = this.keys
      if (!keys) {
        keys = Object.keys(this.data)
      }
      if (typeof keys === 'string') {
        keys = map(this.data, keys)
      }
      return keys.map(String)
    },
    selectedItems () {
      return (this.localSelectedKeys || []).reduce((selectedItems, key) => {
        selectedItems[key] = this.getItem(key)
        return selectedItems
      }, {})
    },
    selectStatus () {
      let keys = this.realKeys
      let inter = intersection(keys, this.localSelectedKeys)
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
        let key = this.realKeys[index]
        if (selected) {
          this.localSelectedKeys.push(key)
        } else {
          this.localSelectedKeys.splice(indexOf(this.localSelectedKeys, key), 1)
        }
        this.$emit('select', selected, item, this.selectedItems)
      } else {
        if (selected) {
          this.localSelectedKeys = [...this.realKeys]
        } else {
          this.localSelectedKeys = []
        }
        this.$emit('select', selected, this.selectedItems)
      }
      this.$emit('update:selected', this.localSelectedKeys)
    },
    getItem (key) {
      return this.data[indexOf(this.realKeys, key)]
    },
    sort (field, order) {
      this.$emit('sort', field, order)
    }
  },
  watch: {
    selected (value) {
      this.localSelectedKeys = value
    },
    realKeys (value) {
      this.localSelectedKeys = intersection(this.localSelectedKeys, value)
      this.$emit('update:selected', this.localSelectedKeys)
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
    height: 54px;
    padding: 20px;
    color: @veui-gray-color-normal;
    text-align: left;
    white-space: nowrap;
  }

  th {
    font-weight: @veui-font-weight-bold;
  }

  td {
    border: 1px solid @veui-gray-color-sup-2;
    border-style: solid none;
  }

  tfoot th {
    border-top: 1px solid @veui-gray-color-sup-2;
  }

  &[ui~="slim"] {
    th,
    td {
      height: 48px;
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

  td&-no-data {
    text-align: center;
  }

  &-selected-row td {
    background-color: @veui-theme-color-sup-4;
  }

  .veui-button + .veui-button {
    margin-left: 30px;
  }

  &-header {
    display: inline-block;
    vertical-align: middle;
  }

  &-sorter {
    margin-left: 5px;
    vertical-align: middle;
  }
}
</style>
