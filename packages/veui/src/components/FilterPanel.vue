<template>
  <div class="veui-filter-panel">
    <h3 class="veui-filter-panel-title">
      <slot name="head">标题</slot>
    </h3>
    <div class="veui-filter-panel-content">
      <veui-searchbox v-model="keyword"
        v-if="searchable"
        ui="small"
        :placeholder="placeholder"></veui-searchbox>
      <div class="veui-filter-panel-content-main"
        v-if="datasource.length"
        ref="main">
        <slot :options="filteredDatasource"></slot>
      </div>
      <div class="veui-filter-panel-no-data" v-else>
        <slot name="no-data">没数据</slot>
      </div>
    </div>
  </div>
</template>

<script>
import Searchbox from './Searchbox'
import Tree from './Tree'
import Icon from './Icon'
import { includes, debounce, cloneDeep, omit } from 'lodash'
import { icons } from '../mixins'

export default {
  name: 'veui-filter-panel',
  components: {
    'veui-searchbox': Searchbox,
    'veui-tree': Tree,
    'veui-icon': Icon
  },
  mixins: [icons],
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    searchable: {
      type: Boolean,
      default: true
    },
    filter: {
      type: Function,
      default (keyword, item) {
        return includes(item.label, keyword)
      }
    },
    placeholder: String
  },
  data () {
    return {
      keyword: '',
      filteredDatasource: cloneDeep(this.datasource)
    }
  },
  created () {
    this.search()

    let me = this
    this.debounceSearch = debounce(function () {
      me.search()
    }, 200)
  },
  watch: {
    datasource () {
      this.search()
    },
    keyword () {
      this.debounceSearch()
    }
  },
  methods: {
    search () {
      if (!this.searchable) {
        return
      }

      let walk = (options, filteredOptions) => {
        let hasVisibleOption = false
        options.forEach((option, index) => {
          let filteredChildren = []
          let isSelfVisible = this.filter(this.keyword, option, index, options, this.datasource)
          let isChildrenVisible = option.children && option.children.length && walk(option.children, filteredChildren)

          if (isSelfVisible || isChildrenVisible) {
            hasVisibleOption = true
            filteredOptions.push({
              ...omit(option, 'children'),
              children: filteredChildren
            })
          }
        })
        return hasVisibleOption
      }

      let filteredDatasource = []
      walk(this.datasource, filteredDatasource)
      this.filteredDatasource = filteredDatasource
    }
  },
  beforeDestroy () {
    this.debounceSearch.cancel()
  }
}
</script>
