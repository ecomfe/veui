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
        <slot :options="filteredDatasource"/>
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
import ui from '../mixins/ui'
import { includes, debounce, cloneDeep } from 'lodash'

export default {
  name: 'veui-filter-panel',
  components: {
    'veui-searchbox': Searchbox,
    'veui-tree': Tree,
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

      let walk = (options, filteredOptions) => {
        let hasVisibleOption = false
        options.forEach((option, index) => {
          let isSelfVisible = this.filter(this.keyword, option, index, options, this.datasource)
          let isChildrenVisible = option.children && option.children.length && walk(option.children, filteredOptions[index].children)

          let isHidden = !isSelfVisible && !isChildrenVisible
          hasVisibleOption = hasVisibleOption || !isHidden
          this.$set(filteredOptions[index], 'hidden', isHidden)
        })
        return hasVisibleOption
      }

      walk(this.datasource, this.filteredDatasource)
    }
  },
  beforeDestroy () {
    this.debounceSearch.cancel()
  }
}
</script>
