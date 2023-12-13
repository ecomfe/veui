<template>
<div
  :class="$c('pagination')"
  role="navigation"
  :aria-label="t('infoLabel', { page, pageCount })"
  :ui="realUi"
>
  <div v-if="showTotal || showPageSize" :class="$c('pagination-info')">
    <div v-if="showTotal" :class="$c('pagination-total')">
      {{ t('total', { total: realTotal }) }}
    </div>
    <div v-if="showPageSize" :class="$c('pagination-size')">
      <veui-select
        v-model="realPageSize"
        :ui="uiParts.pageSize"
        :options="realPageSizes"
        :overlay-class="$c('pagination-select-overlay')"
        :aria-label="t('pageSizeLabel')"
        @change="(size) => $emit('pagesizechange', size)"
      >
        <template #option-label="{ label }">
          {{ t('pageSize', { size: label }) }}
        </template>
        <template #selected="{ label }">
          {{ t('pageSize', { size: label }) }}
        </template>
      </veui-select>
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
          v-tooltip="{
            content: item.forward
              ? getMoreText('nextPages')
              : getMoreText('previousPages'),
            disabled: !item.more
          }"
          :class="{
            [$c('current')]: item.current,
            [$c('pagination-more')]: item.more
          }"
          tabindex="0"
          :disabled="isEmpty"
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
          @keydown.enter="handleEnter(item, $event)"
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
  <div v-if="realShowGoto" :class="$c('pagination-goto')">
    <span
      v-if="gotoPageLabel[0]"
      :class="$c('pagination-goto-label-before')"
    >{{ gotoPageLabel[0] }}</span>
    <veui-input v-model="targetPage" @keydown.enter="gotoPage"/>
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
      @click="handleRedirect(pageNumber, $event)"
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
import useConfig from '../mixins/config'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import { useRename } from '../mixins/deprecate'
import tooltip from '../directives/tooltip'
import warn from '../utils/warn'
import '../common/global'

config.defaults(
  {
    pageSize: 20,
    pageSizes: [20, 50, 100]
  },
  'pagination'
)

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
  directives: {
    tooltip
  },
  mixins: [
    prefix,
    ui,
    i18n,
    useConfig('config', ['pagination']),
    useRename(
      {
        type: Boolean
      },
      {
        from: 'goto',
        to: 'showGoto'
      }
    )
  ],
  props: {
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number
    },
    pageSizes: {
      type: Array
    },
    total: {
      type: Number
    },
    to: [String, Object],
    native: Boolean,
    showPageSize: Boolean,
    showTotal: Boolean
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
    isEmpty () {
      return this.realTotal === 0
    },
    pageNavHref () {
      return {
        prev: this.getPageIndicator(Math.max(1, this.page - 1)),
        next: this.getPageIndicator(Math.min(this.pageCount, this.page + 1))
      }
    },
    realPageSize: {
      get () {
        if (this.customPageSize) {
          return this.customPageSize
        }
        return this.pageSize == null
          ? this.config['pagination.pageSize']
          : this.pageSize
      },
      set (val) {
        val = parseInt(val, 10)
        this.customPageSize = val === this.pageSize ? 0 : val
      }
    },
    realPageSizes () {
      const pageSizes =
        this.pageSizes == null
          ? this.config['pagination.pageSizes']
          : this.pageSizes
      return pageSizes.map((size) => ({
        label: size,
        value: size
      }))
    },
    pageCount () {
      return Math.ceil(this.realTotal / this.realPageSize)
    },
    pageIndicatorSeries () {
      let { page, pageCount, getPageIndicator } = this

      if (this.isEmpty) {
        return [getPageIndicator(1, { current: false })]
      }

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
            .concat(
              getPageIndicator(offsetForward, { more: true, forward: true })
            )
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
            .concat(
              getPageIndicator(offsetBackward, { more: true, forward: false })
            )
            .concat(getPageSeries(pageCount - rightLen + 1, rightLen))

        default:
          return getPageSeries(1, boundaryIndicatorLength)
            .concat(
              getPageIndicator(offsetBackward, { more: true, forward: false })
            )
            .concat(
              getPageSeries(
                page - aroundIndicatorLength,
                continuousIndicatorLength
              )
            )
            .concat(
              getPageIndicator(offsetForward, { more: true, forward: true })
            )
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
    pageNumber () {
      let { targetPage = '' } = this
      let pageStr = targetPage.trim()
      let page = parseInt(pageStr, 10)
      if (isNaN(page) || String(page) !== targetPage) {
        return null
      }
      return page
    },
    realTargetLink () {
      return this.formatHref(this.pageNumber)
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
  created () {
    if ('goto' in this.$options.propsData) {
      warn(
        '[veui-pagination] The `goto` prop is deprecated and will be removed in future versions. Please use the `show-goto` prop instead.'
      )
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
    getMoreText (text) {
      return this.t(text, { count: moreIndicatorOffsetLength })
    },
    getPageIndicator (page, { more = false, forward = false, current } = {}) {
      return {
        page,
        more,
        forward,
        current: current == null ? page === this.page : !!current,
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
      if (!this.pageNumber) {
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
