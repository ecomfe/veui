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
          <li v-for="item in pageIndicatorSeries" :class="{
            'veui-active': item.page === page
          }">
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
            <icon name="chevron-left"></icon>
          </veui-link>
          <veui-link class="veui-button-next"
            :class="{ 'veui-disabled': page === pageCount }"
            :to="page === pageCount ? '' : pageNavHref.next.href"
            :native="native"
            @click="handleRedirect(pageNavHref.next.page, $event)">
            <icon name="chevron-right"></icon>
          </veui-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './Icon'
import Link from './Link'
import Select from './Select'
import Option from './Select/Option'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/chevron-circle-left'
import 'vue-awesome/icons/chevron-circle-right'

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

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-pager {
  @button-width: 36px;
  @button-height: 30px;
  @button-gap-width: 15px;

  @digit-width: 28px;
  @digit-width-delta: 6px;
  @digit-height: 30px;

  @digit-size: 14px;

  color: @veui-text-color-normal;
  font-weight: normal;

  a {
    color: inherit;
    text-decoration: none;
    border-radius: 2px;

    &:focus {
      outline: none;
    }
  }

  .veui-wrapper {
    .clearfix();
  }

  .veui-page-info {
    float: left;
    margin-right: @button-gap-width;
    line-height: @digit-height;
  }

  .veui-page-size {
    margin-left: @button-gap-width;
  }

  .veui-page-switch {
    float: left;
  }

  .veui-select {
    width: auto;
    margin-left: 8px;
    vertical-align: text-top;
    line-height: 1;

    .veui-button {
      white-space: nowrap;
      color: @veui-text-color-strong;
      font-weight: @veui-font-weight-extra-bold;
      .padding(0, _);

      .veui-icon {
        float: left;
      }
    }

    .veui-select-label {
      max-width: none;
      width: auto;
      float: left;
      margin-right: 5px;
    }
  }

  .veui-buttons {
    float: left;
    margin-left: @button-gap-width;
  }

  .veui-button-previous,
  .veui-button-next {
    position: relative;
    float: left;
    width: @button-width;
    height: @button-height;
    line-height: @button-width - 2px;
    text-align: center;
    background-color: @veui-gray-color-sup-3;
    border-radius: 2px;
  }

  .veui-pages {
    float: left;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      float: left;
      width: @digit-width;
      height: @digit-height;
      text-align: center;
      line-height: @digit-height;
      font-size: @digit-size;
      border-radius: 2px;

      a {
        display: block;

        &:hover {
          color: @veui-text-color-strong;
          font-weight: @veui-font-weight-extra-bold;
        }

        &:focus {
          color: @veui-theme-color-primary;
        }
      }
    }

    .veui-active a {
      color: @veui-text-color-strong;
      font-weight: @veui-font-weight-extra-bold;
      background-color: @veui-gray-color-sup-3;
    }

    span {
      color: @veui-gray-color-weak;
    }
  }

  .generate-responsive-page-digit-width(@length, @scale-ratio: 1) when (@length > 2) {

    .veui-page-digit-length-@{length} {
      li {
        width: (@digit-width + @digit-width-delta * (@length - 2)) * @scale-ratio;
      }
    }

    .generate-responsive-page-digit-width(@length - 1, @scale-ratio);
  }

  .generate-responsive-page-digit-width(4);

  &,
  &[ui~="slim"] {
    .veui-page-switch {
      padding: 0 @button-width + @button-gap-width;
      position: relative;
    }

    .veui-button-previous {
      position: absolute;
      left: 0;
    }
  }

  &[ui~="hetero"],
  &[ui~="full"] {
    .veui-page-switch {
      padding-left: 0;
    }

    .veui-button-previous {
      position: static;
      margin-right: 5px;
    }
  }

  .veui-page-info {
    display: none;
  }

  &[ui~="full"] {
    .veui-page-info {
      display: block;
    }
  }

  &:not([ui~="slim"]) {
    .veui-button-previous,
    .veui-button-next {
      .veui-button-alt();
      .veui-button-transition();
    }
  }

  &[ui~="slim"] {
    @scale-ratio: 2 / 3;

    .veui-page-switch {
      padding: 0 (@button-height + @button-gap-width) * @scale-ratio;

      li {
        width: @digit-width * @scale-ratio;
        height: @digit-height * @scale-ratio;
        line-height: @digit-height * @scale-ratio;
        font-size: 13px;
      }

      .veui-active a {
        background: transparent;
      }
    }

    .veui-button-previous,
    .veui-button-next {
      width: @button-height * @scale-ratio;
      height: @button-height * @scale-ratio;
      line-height: 1.5;
      border: 1px solid @veui-gray-color-sup-1;
      border-radius: 50%;
      color: @veui-text-color-weak;
      background: transparent;
      .veui-button-transition();

      &:focus {
        color: @veui-theme-color-primary;
        .veui-shadow(none);
      }

      &:hover {
        color: @veui-text-color-strong;
        .veui-shadow();
      }

      &:active {
        background-color: @veui-gray-color-sup-3;
        color: @veui-text-color-strong;
        .veui-shadow(none);
      }

      &.veui-disabled {
        background-color: @veui-gray-color-sup-3;
        border-color: @veui-gray-color-sup-3;
        color: @veui-text-color-weak;
        cursor: not-allowed;
        .veui-shadow(none);
      }

      .veui-icon {
        width: @button-height * .2;
        .position-center()
      }
    }

    .generate-responsive-page-digit-width(4, .8);
  }
}
</style>
