<template>
<div
  class="veui-pagination"
  role="navigation"
  :aria-label="t('infoLabel', { page, pageCount })"
  :ui="realUi"
>
  <div class="veui-pagination-info">
    <div class="veui-pagination-total">
      {{ t('total', { total: realTotal }) }}
    </div>
    <div class="veui-pagination-size">
      <span>{{ t('pageSize') }}</span>
      <veui-select
        v-model="realPageSize"
        :ui="uiParts.pageSize"
        :options="realPageSizes"
        overlay-class="veui-pagination-select-overlay"
        :aria-label="t('pageSizeLabel')"
        @change="size => $emit('pagesizechange', size)"
      />
    </div>
  </div>
  <div class="veui-pagination-switch">
    <veui-link
      :tabindex="to || page === 1 ? null : '0'"
      :role="to ? null : 'button'"
      class="veui-pagination-prev"
      :to="page === 1 ? '' : pageNavHref.prev.href"
      :native="native"
      :disabled="page === 1"
      :aria-label="t('prev')"
      @keydown.native.enter.space.prevent="handleRedirect(pageNavHref.prev.page)"
      @click="handleRedirect(pageNavHref.prev.page, $event)"
    >
      <veui-icon :name="icons.prev"/>
    </veui-link>
    <ul
      class="veui-pagination-pages"
      :class="{[`veui-pagination-digit-length-${pageDigitLength}`]: true}"
    >
      <li
        v-for="item in pageIndicatorSeries"
        :key="`${item.page}-${item.text}`"
        :class="{
          'veui-pagination-page': true,
          'veui-active': item.page === page
        }"
      >
        <veui-link
          :class="{
            'veui-current': item.page === page
          }"
          :tabindex="to || item.page === page ? null : '0'"
          :role="to ? null : 'button'"
          :to="item.page === page ? null : item.href"
          :native="native"
          :aria-current="item.page === page ? 'page' : null"
          :aria-label="item.page === page ? t('current', { page: item.page }) : t('pageLabel', { page: item.page })"
          @keydown.native.enter.space.prevent="handleRedirect(item.page)"
          @click="handleRedirect(item.page, $event)"
        >
          {{ item.text }}
        </veui-link>
      </li>
    </ul>
    <veui-link
      :tabindex="to || page === pageCount ? null : '0'"
      :role="to ? null : 'button'"
      class="veui-pagination-next"
      :to="page === pageCount ? '' : pageNavHref.next.href"
      :native="native"
      :disabled="page === pageCount || pageCount === 0"
      :aria-label="t('next')"
      @keydown.native.enter.space.prevent="handleRedirect(pageNavHref.next.page)"
      @click="handleRedirect(pageNavHref.next.page, $event)"
    >
      <veui-icon :name="icons.next"/>
    </veui-link>
  </div>
</div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import Select from './Select'
import config from '../managers/config'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'

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
  components: {
    'veui-icon': Icon,
    'veui-link': Link,
    'veui-select': Select
  },
  mixins: [ui, i18n],
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
    to: [String, Object],
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
    baseTo () {
      let { to } = this
      if (to == null) {
        return null
      }
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
        prev: this.getPageIndicator(Math.max(1, this.page - 1)),
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
      let { page, pageCount, getPageIndicator } = this

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

      function getPageSeries (from, length) {
        let series = []
        for (let i = 0; i < length; i++) {
          series[i] = getPageIndicator(from + i)
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
      if (page !== this.page) {
        this.$emit('redirect', page, event)
      }
    },

    getPageIndicator (page, isMore = false) {
      return {
        page,
        text: isMore ? '...' : page,
        href: page ? this.formatHref(page) : null
      }
    },

    formatHref (page) {
      let { baseTo } = this
      if (baseTo === null) {
        return null
      }
      return baseTo.replace(HREF_TPL_PLACEHOLDER, page)
    }
  }
}
</script>
