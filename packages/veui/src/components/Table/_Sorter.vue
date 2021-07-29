<template>
<veui-button
  :ui="table.uiParts.icon"
  :class="klass"
  @click="sort"
>
  <veui-icon
    :class="[$c('table-sorter-icon-sort'), $c('table-header-icon')]"
    :name="table.icons.sort"
  />
  <veui-icon
    :class="{
      [$c('table-header-icon')]: true,
      [$c('table-sorter-icon-asc')]: true,
      [$c('table-header-icon-active')]: order === 'asc'
    }"
    :name="table.icons.asc"
  />
  <veui-icon
    :class="{
      [$c('table-header-icon')]: true,
      [$c('table-sorter-icon-desc')]: true,
      [$c('table-header-icon-active')]: order === 'desc'
    }"
    :name="table.icons.desc"
  />
</veui-button>
</template>

<script>
import Icon from '../Icon'
import Button from '../Button'
import prefix from '../../mixins/prefix'
import table from '../../mixins/table'
import config from '../../managers/config'
import useConfig from '../../mixins/config'
import '../../common/uiTypes'
import warn from '../../utils/warn'
import { intersection, includes } from 'lodash'

config.defaults(
  {
    allowedOrders: [false, 'desc', 'asc']
  },
  'table'
)

const allowedOrders = [false, 'desc', 'asc']

export default {
  name: 'veui-table-sorter',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [prefix, table, useConfig('config', 'table.')],
  uiTypes: ['transparent'],
  props: {
    order: [Boolean, String],
    allowedOrders: {
      type: Array,
      validator (val) {
        if (!Array.isArray(val)) {
          return false
        }
        return intersection(val, allowedOrders).length === val.length
      }
    }
  },
  computed: {
    realAllowedOrders () {
      return this.allowedOrders == null
        ? this.config['table.allowedOrders']
        : this.allowedOrders
    },
    klass () {
      let orders = this.realAllowedOrders.filter(i => i !== false)
      return {
        [this.$c('table-sorter')]: true,
        [this.$c(`table-sorter-${this.realOrder}`)]: true,
        [this.$c(
          `table-sorter-${this.order === false ? 'un' : ''}ordered`
        )]: true,
        [this.$c('table-sorter-reverse')]: this.order === orders[1]
      }
    },
    realOrder () {
      return !this.order ? 'unordered' : this.order
    },
    orderOptions () {
      return { order: this.order, allowedOrders: this.realAllowedOrders }
    }
  },
  watch: {
    orderOptions: {
      handler ({ order, allowedOrders }) {
        if (!includes(allowedOrders, order) && order !== false) {
          warn(
            `[veui-table] invalid order: ${order}, allowed orders are ${allowedOrders}`,
            this
          )
        }
      },
      immediate: true
    }
  },
  methods: {
    sort () {
      // -1 + 1 = 0, 正好取第一个
      let orders = this.realAllowedOrders
      let index = orders.indexOf(this.order)
      this.$emit('sort', orders[(index + 1) % orders.length])
    }
  }
}
</script>
