<template>
  <div class="veui-select-panel">
    <h3 class="veui-select-panel-title">
      <slot name="head">标题</slot>
    </h3>
    <div class="veui-select-panel-content">
      <veui-searchbox v-model="keyword"
        v-if="searchable"
        :placeholder="placeholder"></veui-searchbox>
      <div class="veui-select-panel-content-main"
        v-if="datasource.length"
        ref="main">
        <slot :options="datasource"></slot>
      </div>
      <div class="veui-select-panel-no-data" v-else>
        <slot name="no-data">没数据</slot>
      </div>
    </div>
  </div>
</template>

<script>
import Searchbox from './Searchbox'
import Tree from './Tree'
import Icon from './Icon'
import { includes, debounce } from 'lodash'
import { icons } from '../mixins'

export default {
  name: 'veui-select-panel',
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
      keyword: ''
    }
  },
  created () {
    this.search()
    this.debounceSearch = debounce(function () {
      this.search()
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

      let walk = (options) => {
        let isAllVisible = true
        options.forEach((option, index) => {
          let isSelfVisible = this.filter(this.keyword, option, index, options, this.datasource)
          let isChildrenVisible = option.children && option.children.length && walk(option.children)
          this.$set(option, 'hidden', !isSelfVisible && !isChildrenVisible)

          if (option.hidden) {
            isAllVisible = false
          }
        })

        return isAllVisible
      }

      walk(this.datasource)
    }
  },
  beforeDestroy () {
    this.debounceSearch.cancel()
  }
}
</script>
