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
  mixins: [prefix, table],
  uiTypes: ['transparent'],
  props: {
    order: [Boolean, String],
    allowedOrders: {
      type: Array,
      default: () => config.get('table.allowedOrders'),
      validator (val) {
        if (!Array.isArray(val)) {
          return false
        }
        return intersection(val, allowedOrders).length === val.length
      }
    }
  },
  computed: {
    klass () {
      let orders = this.allowedOrders.filter(i => i !== false)
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
      return { order: this.order, allowedOrders: this.allowedOrders }
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
      let index = this.allowedOrders.indexOf(this.order)
      this.$emit(
        'sort',
        this.allowedOrders[(index + 1) % this.allowedOrders.length]
      )
    }
  }
}
</script>
