<template>
  <!--
    veui-search-select-panel-one-depth 树形结构只有一级的时候加上的 class 。
    veui-search-select-panel-multi-depth 树形结构有多级的时候加上的 class 。
    目前用于去掉一级树形结构时，每一个 item 前面多余的 padding 。
  -->
  <div class="veui-search-select-panel"
    :class="{'veui-search-select-panel-multi-depth': isMultiDepth, 'veui-search-select-panel-one-depth': !isMultiDepth}">
    <h3 class="veui-search-select-panel-title">
      <slot name="title">标题</slot>
    </h3>
    <div class="veui-search-select-panel-content">
      <veui-searchbox v-model="keyword"
        v-if="searchable"
        :placeholder="placeholder"></veui-searchbox>
      <div class="veui-search-select-panel-content-main"
        v-if="options.length"
        ref="main">
        <slot name="main"
          :options="showMode === 'tree' ? options : flattenOptions"
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
import { includes, debounce, contains, find, reduce, get } from 'lodash'
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
    options: {
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
        return contains(['tree', 'flat'], value)
      }
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  computed: {
    isMultiDepth () {
      return !!find(this.options, option => !option.hidden && option.children && option.children.length)
    },
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
      this.options.forEach(option => {
        let itemPaths = []
        walk(option, [], itemPaths)
        paths.push(...itemPaths)
      })
      return paths
    }
  },
  created () {
    this.search()
  },
  watch: {
    options () {
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
        let hasSomeOptionVisible = false
        options.forEach((option, index) => {
          let isSelfVisible = this.filter(this.keyword, option, index, options, this.options)
          let isChildrenVisible = option.children && option.children.length && walk(option.children)
          this.$set(option, 'hidden', !isSelfVisible && !isChildrenVisible)

          if (!option.hidden) {
            hasSomeOptionVisible = true
          }
        })

        return hasSomeOptionVisible
      }

      walk(this.options)
    },
    debounceSearch: debounce(function () {
      this.search()
    }, 200),
    // 如果 main 区域出现滚动条，则在该元素上面设置一个 css class ，
    // 目前主要为了让 item 右侧的图标的位置不会因为滚动条的出现而发生变动。
    setScrollClass () {
      this.$nextTick(() => {
        let element = get(this, '$refs.main')
        if (!element) {
          return
        }

        let klass = 'veui-search-select-panel-content-main-scroll-vertical'
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
  }
}
</script>
