<template>
<div
  :class="{
    [$c('filter-panel')]: true,
    [$c('filter-panel-single-level')]: singleLevel
  }"
  :ui="realUi"
>
  <h3 :class="$c('filter-panel-title')">
    <slot name="head">
      {{ title }}
    </slot>
  </h3>
  <div :class="$c('filter-panel-content')">
    <veui-searchbox
      v-if="searchable"
      v-model="keyword"
      :ui="uiParts.search"
      :placeholder="placeholder"
      @search="debounceSearch"
      @input="searchOnInput && debounceSearch()"
    />
    <div
      v-if="datasource && datasource.length"
      ref="main"
      :class="$c('filter-panel-content-main')"
    >
      <slot
        :items="filteredDatasource"
        :keyword="keyword"
      />
    </div>
    <div
      v-else
      :class="$c('filter-panel-no-data')"
    >
      <slot name="no-data">
        {{ t('noData') }}
      </slot>
    </div>
  </div>
</div>
</template>

<script>
import Searchbox from './Searchbox'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import { includes, debounce, cloneDeep } from 'lodash'

export default {
  name: 'veui-filter-panel',
  components: {
    'veui-searchbox': Searchbox
  },
  mixins: [prefix, ui, i18n],
  props: {
    title: String,
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
  computed: {
    singleLevel () {
      if (!this.datasource) {
        return false
      }

      return !this.datasource.some(
        item => item.children && item.children.length > 0
      )
    }
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
  created () {
    this.debounceSearch = debounce(() => this.search(), 200)
  },
  beforeDestroy () {
    this.debounceSearch.cancel()
  },
  methods: {
    search () {
      if (!this.searchable || !this.datasource) {
        return
      }

      let walk = (items, filteredItems) => {
        let hasVisibleItem = false
        items.forEach((item, index) => {
          let isSelfVisible = this.filter(
            this.keyword,
            item,
            index,
            items,
            this.datasource
          )
          let isChildrenVisible =
            item.children &&
            item.children.length &&
            walk(item.children, filteredItems[index].children)

          let isHidden = !isSelfVisible && !isChildrenVisible
          hasVisibleItem = hasVisibleItem || !isHidden
          this.$set(filteredItems[index], 'hidden', isHidden)
        })
        return hasVisibleItem
      }

      walk(this.datasource, this.filteredDatasource)
    }
  }
}
</script>
