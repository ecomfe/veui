<template>
<div
  class="veui-pagination veui-pager"
  role="navigation"
  :aria-label="`选择分页，当前为第 ${page} 页，共 ${pageCount} 页`"
  :ui="ui">
  <div class="veui-pager-info">
    <div class="veui-pager-total">共 {{ realTotal }} 条</div>
    <div class="veui-pager-size">
      <span>每页条数</span>
      <veui-select v-model="realPageSize"
        :options="realPageSizes"
        :aria-label="`选择每页显示条数，目前为 ${realPageSize} 条`"
        @change="size => $emit('pagesizechange', size)">
      </veui-select>
    </div>
  </div>
  <div class="veui-pager-switch">
    <ul class="veui-pager-pages" :class="{[`veui-pager-digit-length-${pageDigitLength}`]: true}">
      <li
        v-for="(item, index) in pageIndicatorSeries"
        :class="{
          'veui-active': item.page === page
        }"
        :key="index">
        <veui-link
          :to="item.href"
          :native="native"
          :aria-current="item.page === page ? 'page' : null"
          :aria-label="`第 ${item.page} 页${item.page === page ? '，当前页' : ''}`"
          @click="handleRedirect(item.page, $event)">{{ item.text }}</veui-link>
      </li>
    </ul>
    <div class="veui-pager-buttons">
      <veui-link class="veui-pager-previous"
        :to="page === 1 ? '' : pageNavHref.previous.href"
        :native="native"
        :disabled="page === 1"
        aria-label="上一页"
        @click="handleRedirect(pageNavHref.previous.page, $event)">
        <veui-icon :name="icons.prev"/>
      </veui-link>
      <veui-link class="veui-pager-next"
        :to="page === pageCount ? '' : pageNavHref.next.href"
        :native="native"
        :disabled="page === pageCount || pageCount === 0"
        aria-label="下一页"
        @click="handleRedirect(pageNavHref.next.page, $event)">
        <veui-icon :name="icons.next"/>
      </veui-link>
    </div>
  </div>
</div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import Select from './Select'
import Option from './Select/Option'
import config from '../managers/config'
import ui from '../mixins/ui'

config.defaults({
  'pagination.pageSize': 30,
  'pagination.pageSizes': [30, 50, 100],
  'pager.pageSize': 30,
  'pager.pageSizes': [30, 50, 100]
})

const HREF_TPL_PLACEHOLDER = /:page\b/g

/**
 * 总页面切换按钮数
 * @type {Number}
 */
const pageIndicatorLength = 9

/**
 * 围绕切换按钮数
 * @type {Number}
 */
const aroundIndicatorLength = 2

/**
 * 省略号点击跳转偏移页数
 * @type {Number}
 */
const moreIndicatorOffsetLength = 5

export default {
  name: 'veui-pagination',
  mixins: [ui],
  components: {
    'veui-icon': Icon,
    'veui-link': Link,
    'veui-select': Select,
    'veui-option': Option
  },
  props: {
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default () {
        return config.get('pagination.pageSize') || config.get('pager.pageSize')
      }
    },
    pageSizes: {
      type: Array,
      default () {
        return config.get('pagination.pageSizes') || config.get('pager.pageSizes')
      }
    },
    total: {
      type: Number
    },
    to: {
      type: [String, Object],
      default: ''
    },
    native: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      customPageSize: 0
    }
  },
  computed: {
    realTo () {
      let to = this.to
      if (typeof to === 'string') {
        return to
      } else {
        return this.$router.resolve(to).href.substring(1)
      }
    },
    realTotal () {
      return this.total || 0
    },
    pageNavHref () {
      return {
        previous: this.getPageIndicator(Math.max(1, this.page - 1)),
        next: this.getPageIndicator(Math.min(this.pageCount, this.page + 1))
      }
    },
    realPageSize: {
      get () {
        return this.customPageSize || this.pageSize
      },
      set (val) {
        val = parseInt(val, 10)
        this.customPageSize = val === this.pageSize ? 0 : val
      }
    },
    realPageSizes () {
      return this.pageSizes.map(size => ({
        label: size,
        value: size
      }))
    },
    pageCount () {
      return Math.ceil(this.realTotal / this.realPageSize)
    },
    pageIndicatorSeries () {
      let {page, pageCount, getPageIndicator} = this

      let continuousIndicatorLength = aroundIndicatorLength * 2 + 1
      let boundaryIndicatorLength = (pageIndicatorLength - continuousIndicatorLength - 2) / 2

      let leftLen
      let rightLen
      let offsetBackward = Math.max(page - moreIndicatorOffsetLength, 1)
      let offsetForward = Math.min(page + moreIndicatorOffsetLength, pageCount)

      switch (true) {
        case pageCount <= pageIndicatorLength:
          return getPageSeries(1, pageCount)

        case page < continuousIndicatorLength:
          leftLen = Math.max(continuousIndicatorLength, page + aroundIndicatorLength)
          rightLen = pageIndicatorLength - leftLen - 1
          return getPageSeries(1, leftLen)
            .concat(getPageIndicator(offsetForward, true))
            .concat(getPageSeries(pageCount - rightLen + 1, rightLen))

        case page > pageCount - continuousIndicatorLength + 1:
          rightLen = Math.max(pageCount - page + 1 + aroundIndicatorLength, continuousIndicatorLength)
          leftLen = pageIndicatorLength - rightLen - 1
          return getPageSeries(1, leftLen)
            .concat(getPageIndicator(offsetBackward, true))
            .concat(getPageSeries(pageCount - rightLen + 1, rightLen))

        default:
          return getPageSeries(1, boundaryIndicatorLength)
            .concat(getPageIndicator(offsetBackward, true))
            .concat(getPageSeries(page - boundaryIndicatorLength - 1, continuousIndicatorLength))
            .concat(getPageIndicator(offsetForward, true))
            .concat(getPageSeries(pageCount, boundaryIndicatorLength))
      }

      function getPageSeries (frompage, length) {
        let series = []
        for (let i = 0; i < length; i++) {
          series[i] = getPageIndicator(frompage + i)
        }
        return series
      }
    },

    pageDigitLength () {
      return this.pageCount.toString(10).length
    }
  },
  watch: {
    pageSize (val) {
      // Caller update pagesize -> reset/override user's custom pagesize
      this.customPageSize = 0
    },
    realPageSize (val) {
      // User updated pageSize -> Tell caller the modification
      this.$emit('update:pageSize', val)
    }
  },
  methods: {
    handleRedirect (page, event) {
      this.$emit('redirect', {page, event})
    },

    getPageIndicator (page, isMore = false) {
      return {
        page,
        text: isMore ? '...' : page,
        href: page ? this.formatHref(page) : null
      }
    },

    formatHref (page) {
      return this.realTo.replace(HREF_TPL_PLACEHOLDER, page)
    }
  }
}
</script>
