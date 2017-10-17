<template>
  <div class="veui-search-select-panel">
    <h3 class="veui-search-select-panel-title">
      <slot name="head">标题</slot>
    </h3>
    <div class="veui-search-select-panel-content">
      <veui-searchbox v-model="keyword"
        v-if="searchable"
        :placeholder="placeholder"></veui-searchbox>
      <div class="veui-search-select-panel-content-main"
        v-if="datasource.length"
        ref="main">
        <slot :options="showMode === 'tree' ? datasource : flattenOptions"
          :show-mode="showMode"></slot>
      </div>
      <div class="veui-search-select-panel-no-data" v-else>
        <slot name="no-data">没数据</slot>
      </div>
    </div>
  </div>
</template>

<script>
import Searchbox from './Searchbox'
import Tree from './Tree'
import Icon from './Icon'
import { includes, debounce, reduce } from 'lodash'
import { normalizeClass } from '../utils/helper'
import { icons } from '../mixins'

export default {
  name: 'veui-search-select-panel',
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
    placeholder: String,
    showMode: {
      default: 'tree',
      validate (value) {
        return includes(['tree', 'flat'], value)
      }
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  computed: {
    flattenOptions () {
      let walk = (option, path, paths) => {
        if (!option.children || !option.children.length) {
          paths.push([...path, option])
          return
        }

        option.children.forEach(child => {
          walk(child, [...path, option], paths)
        })
      }

      let paths = []
      this.datasource.forEach(option => {
        let itemPaths = []
        walk(option, [], itemPaths)
        paths.push(...itemPaths)
      })
      return paths
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
    },
    // 如果 main 区域出现滚动条，则在该元素上面设置一个 class ，
    // 目前主要为了让 item 右侧的图标的位置不会因为滚动条的出现而发生变动。
    setScrollClass () {
      this.$nextTick(() => {
        let element = this.$refs.main
        if (!element) {
          return
        }

        let klass = 'veui-search-select-panel-scroll-vertical'
        let contentHeight = parseFloat(getComputedStyle(element).height)
        let classObj = normalizeClass(element.className)
        classObj[klass] = element.scrollHeight > contentHeight

        element.className = reduce(classObj, (result, value, key) => {
          if (value) {
            result.push(key)
          }
          return result
        }, []).join(' ')
      })
    }
  },
  mounted () {
    this.setScrollClass()
  },
  updated () {
    this.setScrollClass()
  },
  beforeDestroy () {
    this.debounceSearch.cancel()
  }
}
</script>
