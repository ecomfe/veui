<template>
  <div class="veui-filter-panel" :ui="ui">
    <h3 class="veui-filter-panel-title">
      <slot name="head">标题</slot>
    </h3>
    <div class="veui-filter-panel-content">
      <veui-searchbox v-model="keyword"
        v-if="searchable"
        ui="small"
        :placeholder="placeholder"
        @search="debounceSearch"
        @input="searchOnInput && debounceSearch()"></veui-searchbox>
      <div class="veui-filter-panel-content-main"
        v-if="datasource.length"
        ref="main">
        <slot :items="filteredDatasource"/>
      </div>
      <div class="veui-filter-panel-no-data" v-else>
        <slot name="no-data">没数据</slot>
      </div>
    </div>
  </div>
</template>

<script>
import Searchbox from './Searchbox'
import Icon from './Icon'
import ui from '../mixins/ui'
import { includes, debounce, cloneDeep } from 'lodash'

export default {
  name: 'veui-filter-panel',
  components: {
    'veui-searchbox': Searchbox,
    'veui-icon': Icon
  },
  mixins: [ui],
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
    searchOnInput: {
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
      filteredDatasource: []
    }
  },
  created () {
    let me = this
    this.debounceSearch = debounce(() => me.search(), 200)
  },
  watch: {
    datasource: {
      handler () {
        this.filteredDatasource = cloneDeep(this.datasource)
        this.search()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    search () {
      if (!this.searchable) {
        return
      }

      let walk = (items, filteredItems) => {
        let hasVisibleItem = false
        items.forEach((item, index) => {
          let isSelfVisible = this.filter(this.keyword, item, index, items, this.datasource)
          let isChildrenVisible = item.children && item.children.length && walk(item.children, filteredItems[index].children)

          let isHidden = !isSelfVisible && !isChildrenVisible
          hasVisibleItem = hasVisibleItem || !isHidden
          this.$set(filteredItems[index], 'hidden', isHidden)
        })
        return hasVisibleItem
      }

      walk(this.datasource, this.filteredDatasource)
    }
  },
  beforeDestroy () {
    this.debounceSearch.cancel()
  }
}
</script>
