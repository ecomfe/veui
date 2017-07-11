<template>
  <div class="veui-pager" :ui="ui">
    <div class="veui-wrapper">
      <div class="veui-page-info">
        <span class="veui-page-total">共 {{ pageTotal }} 条</span>
        <span class="veui-page-size">每页显示<veui-select v-model="realPageSize"
            ui="link"
            :options="optionalPageSizes"
            @change="size => $emit('pagesizechange', size)">
          </veui-select>
        </span>
      </div>
      <div class="veui-page-switch">
        <ul class="veui-pages" :class="{['veui-page-digit-length-' + pageDigitLength]: true}">
          <li v-for="(item, index) in pageIndicatorSeries" :class="{
            'veui-active': item.page === page
          }" :key="index">
            <veui-link :to="item.href" :native="native"
              @click="handleRedirect(item.page, $event)">{{ item.text }}</veui-link>
          </li>
        </ul>
        <div class="veui-buttons">
          <veui-link class="veui-button-previous"
            :class="{ 'veui-disabled': page === 1 }"
            :to="page === 1 ? '' : pageNavHref.previous.href"
            :native="native"
            @click="handleRedirect(pageNavHref.previous.page, $event)">
            <icon name="angle-left"></icon>
          </veui-link>
          <veui-link class="veui-button-next"
            :class="{ 'veui-disabled': page === pageCount }"
            :to="page === pageCount ? '' : pageNavHref.next.href"
            :native="native"
            @click="handleRedirect(pageNavHref.next.page, $event)">
            <icon name="angle-right"></icon>
          </veui-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './Icon'
import '../icons'
import Link from './Link'
import Select from './Select'
import Option from './Select/Option'

const OPTIONAL_PAGE_SIZES = [
  30, 60, 100, 200
]

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
  name: 'veui-pager',
  components: {
    Icon,
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
      default: 30
    },
    pageTotal: {
      type: Number,
      required: true
    },
    to: {
      type: [String, Object],
      default: ':page'
    },
    ui: String,
    native: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      customPageSize: 0,
      optionalPageSizes: OPTIONAL_PAGE_SIZES.map(size => ({
        label: size,
        value: size
      }))
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
    pageCount () {
      return Math.ceil(this.pageTotal / this.realPageSize)
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
