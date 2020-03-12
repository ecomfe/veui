<template>
<veui-button
  :ui="table.uiParts.icon"
  :class="klass"
  @click="sort"
>
  <veui-icon
    v-if="!order"
    key="unordered"
    :name="table.icons.sort"
  />
  <veui-icon
    v-else
    key="ordered"
    :name="icons[order]"
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

export default {
  name: 'veui-table-sorter',
  components: {
    'veui-icon': Icon,
    'veui-button': Button
  },
  mixins: [prefix, table],
  uiTypes: ['transparent'],
  props: {
    order: {
      type: [String, Boolean],
      default: false,
      validator (val) {
        return val === false || val === 'asc' || val === 'desc'
      }
    },
    allowedOrders: {
      type: Array,
      default () {
        return config.get('table.allowedOrders')
      },
      validator (val) {
        if (val === false) {
          return true
        }
        if (!Array.isArray(val)) {
          return false
        }

        return (
          val.length <= 2 &&
          val.every(o => o === 'asc' || o === 'desc') &&
          val[0] !== val[1]
        )
      }
    }
  },
  computed: {
    klass () {
      return {
        [this.$c('table-sorter')]: true,
        [this.$c(`table-sorter-${this.realOrder}`)]: true,
        [this.$c(`table-sorter-ordered`)]: this.order !== false,
        [this.$c('table-sorter-reverse')]: this.order === this.realOrders[2]
      }
    },
    realOrder () {
      return !this.order ? 'unordered' : this.order
    },
    realOrders () {
      return [false, ...this.allowedOrders]
    }
  },
  methods: {
    sort () {
      let index = this.realOrders.indexOf(this.order)
      if (index === -1) {
        return
      }

      this.$emit('sort', this.realOrders[(index + 1) % this.realOrders.length])
    }
  }
}
</script>
