<template>
<div
  :class="$c('pagination')"
  role="navigation"
  :aria-label="t('infoLabel', { page, pageCount })"
  :ui="realUi"
>
  <div :class="$c('pagination-info')">
    <div :class="$c('pagination-total')">
      {{ t('total', { total: realTotal }) }}
    </div>
    <div :class="$c('pagination-size')">
      <span>{{ t('pageSize') }}</span>
      <veui-select
        v-model="realPageSize"
        :ui="uiParts.pageSize"
        :options="realPageSizes"
        :overlay-class="$c('pagination-select-overlay')"
        :aria-label="t('pageSizeLabel')"
        @change="size => $emit('pagesizechange', size)"
      />
    </div>
  </div>
  <div :class="$c('pagination-switch')">
    <veui-link
      :tabindex="to || page === 1 ? null : '0'"
      :role="to ? null : 'button'"
      :class="$c('pagination-prev')"
      :to="page === 1 ? '' : pageNavHref.prev.href"
      :native="native"
      :disabled="page === 1"
      :aria-label="t('prev')"
      @click="handleRedirect(pageNavHref.prev.page, $event)"
    >
      <veui-icon :name="icons.prev"/>
    </veui-link>
    <ul
      :class="[
        $c('pagination-pages'),
        $c(`pagination-digit-length-${pageDigitLength}`)
      ]"
    >
      <li
        v-for="(item, i) in pageIndicatorSeries"
        :key="i"
        :class="{
          [$c('pagination-page')]: true,
          [$c('active')]: item.current
        }"
      >
        <veui-link
          :ref="getKey(item)"
          :class="{
            [$c('current')]: item.current,
            [$c('pagination-more')]: item.more
          }"
          tabindex="0"
          :role="to ? null : 'button'"
          :to="item.href"
          :native="native"
          :aria-current="item.current ? 'page' : null"
          :aria-label="
            item.current
              ? t('current', { page: item.page })
              : t('pageLabel', { page: item.page })
          "
          @click="handleRedirect(item, $event)"
          @keydown.native.enter="handleEnter(item, $event)"
        >
          <template v-if="item.more">
            <veui-icon
              :class="$c('pagination-more-ellipsis')"
              :name="icons.more"
            />
            <veui-icon
              :class="$c('pagination-more-arrow')"
              :name="item.forward ? icons.forward : icons.backward"
            />
          </template>
          <template v-else>{{ item.text }}</template>
        </veui-link>
      </li>
    </ul>
    <veui-link
      :tabindex="to || page === pageCount ? null : '0'"
      :role="to ? null : 'button'"
      :class="$c('pagination-next')"
      :to="page === pageCount ? '' : pageNavHref.next.href"
      :native="native"
      :disabled="page === pageCount || pageCount === 0"
      :aria-label="t('next')"
      @click="handleRedirect(pageNavHref.next.page, $event)"
    >
      <veui-icon :name="icons.next"/>
    </veui-link>
  </div>
  <div
    v-if="goto"
    :class="$c('pagination-goto')"
  >
    <span
      v-if="gotoPageLabel[0]"
      :class="$c('pagination-goto-label-before')"
    >{{ gotoPageLabel[0] }}</span>
    <veui-input
      v-model="targetPage"
      @keydown.enter="gotoPage"
    />
    <span
      v-if="gotoPageLabel[1]"
      :class="$c('pagination-goto-label-after')"
    >{{ gotoPageLabel[1] }}</span>
    <veui-button @click="gotoPage">{{ t('go') }}</veui-button>
    <veui-link
      v-show="false"
      ref="goto"
      aria-hidden="true"
      :to="realTargetLink"
    />
  </div>
</div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import Select from './Select'
import Input from './Input'
import Button from './Button'
import config from '../managers/config'
import prefix from '../mixins/prefix'
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
const pageIndicatorLength = 7

/**
 * 围绕当前页面切换按钮数
 * @type {Number}
 */
const aroundIndicatorLength = 1

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
    'veui-select': Select,
    'veui-input': Input,
    'veui-button': Button
  },
  mixins: [prefix, ui, i18n],
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
        return (
          config.get('pagination.pageSizes') || config.get('pager.pageSizes')
        )
      }
    },
    total: {
      type: Number
    },
    to: [String, Object],
    native: {
      type: Boolean,
      default: false
    },
    goto: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      customPageSize: 0,
      targetPage: ''
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
        return this.$router.resolve(to).href
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
      let boundaryIndicatorLength =
        (pageIndicatorLength - continuousIndicatorLength - 2) / 2

      let leftLen
      let rightLen
      let offsetBackward = Math.max(page - moreIndicatorOffsetLength, 1)
      let offsetForward = Math.min(page + moreIndicatorOffsetLength, pageCount)

      switch (true) {
        case pageCount <= pageIndicatorLength:
          return getPageSeries(1, pageCount)

        case page <= boundaryIndicatorLength + aroundIndicatorLength + 2:
          leftLen = pageIndicatorLength - boundaryIndicatorLength - 1
          return getPageSeries(1, leftLen)
            .concat(getPageIndicator(offsetForward, true, true))
            .concat(
              getPageSeries(
                pageCount - boundaryIndicatorLength + 1,
                boundaryIndicatorLength
              )
            )

        case page >=
          pageCount - boundaryIndicatorLength - aroundIndicatorLength - 1:
          rightLen = pageIndicatorLength - boundaryIndicatorLength - 1
          return getPageSeries(1, boundaryIndicatorLength)
            .concat(getPageIndicator(offsetBackward, true, false))
            .concat(getPageSeries(pageCount - rightLen + 1, rightLen))

        default:
          return getPageSeries(1, boundaryIndicatorLength)
            .concat(getPageIndicator(offsetBackward, true, false))
            .concat(
              getPageSeries(
                page - aroundIndicatorLength,
                continuousIndicatorLength
              )
            )
            .concat(getPageIndicator(offsetForward, true, true))
            .concat(
              getPageSeries(
                pageCount - boundaryIndicatorLength + 1,
                boundaryIndicatorLength
              )
            )
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
    },
    gotoPageLabel () {
      return this.t('gotoPage').split('{page}')
    },
    realTargetLink () {
      let { targetPage = '' } = this
      let pageStr = targetPage.trim()
      let page = parseInt(pageStr, 10)
      if (isNaN(page) || String(page) !== targetPage) {
        return null
      }
      return this.formatHref(page)
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
    handleEnter (...args) {
      if (this.to) {
        return
      }
      this.handleRedirect(...args)
    },
    handleRedirect (item, event) {
      let page = typeof item === 'number' ? item : item.page
      if (typeof item !== 'number') {
        this.fixFocus(this.getKey(item))
      }

      if (page !== this.page) {
        this.$emit('redirect', page, event)
      }
    },
    getPageIndicator (page, more = false, forward = false) {
      return {
        page,
        more,
        forward,
        current: page === this.page,
        text: page,
        href: page ? this.formatHref(page) : null
      }
    },
    formatHref (page) {
      let { baseTo } = this
      if (baseTo === null) {
        return null
      }
      return baseTo.replace(HREF_TPL_PLACEHOLDER, page)
    },
    gotoPage () {
      if (this.realTargetLink === null) {
        this.targetPage = ''
        return
      }

      this.$refs.goto.$el.click()
      this.targetPage = ''
    },
    getKey (item) {
      return `p-${item.more ? (item.forward ? 'f' : 'b') : item.page}`
    },
    fixFocus (ref) {
      setTimeout(() => {
        let link = this.$refs[ref][0]
        if (link) {
          link.$el.focus()
        }
      })
    }
  }
}
</script>
