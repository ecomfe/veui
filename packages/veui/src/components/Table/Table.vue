<template>
<table class="veui-table" :ui="ui">
  <colgroup>
    <col v-if="selectable" width="60"></col>
    <col v-for="(col, index) in realColumns" :width="col.width" :key="index"></col>
  </colgroup>
  <table-head @sort="sort"></table-head>
  <table-body><template slot="no-data"><slot name="no-data">没有数据</slot></template></table-body>
  <slot name="foot"><table-foot v-if="hasFoot"></table-foot></slot>
  <slot></slot>
</table>
</template>

<script>
import Vue from 'vue'
import { map, intersection, isString, includes, indexOf, keys as objectKeys } from 'lodash'
import Body from './_TableBody'
import Head from './_TableHead'
import Foot from './_TableFoot'

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
      validator (val) {
        if (!val) {
          return true
        }
        return isString(val) || Array.isArray(val) && val.length === this.data.length
      }
    },
    selectable: Boolean,
    selectMode: {
      type: String,
      default: 'multiple',
      validator (val) {
        return val === 'single' || val === 'multiple'
      }
    },
    order: [String, Boolean],
    orderBy: String,
    columnFilter: Array,
    selected: {
      default () {
        return []
      }
    }
  },
  data () {
    return {
      columns: [],
      localSelected: normalizeArray(this.selected)
    }
  },
  computed: {
    realSelected () {
      return this.selectMode === 'multiple' ? this.localSelected : (this.localSelected[0] || null)
    },
    realColumns () {
      if (!this.columnFilter) {
        return this.columns
      }
      return this.columns.filter(col => includes(this.columnFilter, col.field))
    },
    realKeys () {
      let keys = this.keys
      if (!keys) {
        keys = objectKeys(this.data)
      }
      if (typeof keys === 'string') {
        keys = map(this.data, keys)
      }
      return keys.map(String)
    },
    selectedItems () {
      return this.localSelected.reduce((selectedItems, key) => {
        selectedItems[key] = this.getItem(key)
        return selectedItems
      }, {})
    },
    selectStatus () {
      let keys = this.realKeys
      let inter = intersection(keys, this.localSelected)
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
      let item = null
      if (index !== undefined) {
        item = this.data[index]
        let key = this.realKeys[index]
        if (selected) {
          if (this.selectMode === 'multiple') {
            this.localSelected.push(key)
          } else {
            this.localSelected = [key]
          }
        } else {
          this.localSelected.splice(indexOf(this.localSelected, key), 1)
        }
      } else {
        if (selected) {
          this.localSelected = [...this.realKeys]
        } else {
          this.localSelected = []
        }
      }
      this.$emit('update:selected', this.realSelected)
      this.$emit('select', selected, item, this.selectedItems)
    },
    getItem (key) {
      return this.data[indexOf(this.realKeys, key)]
    },
    sort (field, order) {
      this.$emit('sort', field, order)
    },
    validateSelected (val = this.selected) {
      if (this.selectMode === 'single' && Array.isArray(this.selected)) {
        Vue.util.warn('`selected` should not be an array when `select-mode` is `single`.')
        return false
      } else if (this.selectMode === 'multiple' && !Array.isArray(this.selected)) {
        Vue.util.warn('`selected` should be an array when `select-mode` is `multiple`.')
        return false
      }
      return true
    }
  },
  created () {
    this.validateSelected()
  },
  watch: {
    selected (val) {
      if (this.validateSelected(val)) {
        this.localSelected = normalizeArray(val)
      }
    },
    realKeys (val) {
      this.localSelected = intersection(this.localSelected, val)
      this.$emit('update:selected', this.realSelected)
    }
  }
}

function normalizeArray (val) {
  if (val == null) {
    return []
  }

  return Array.isArray(val) ? val : [val]
}
</script>
