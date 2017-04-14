<template>
  <div class="veui-pager" :ui="ui">
    <div class="veui-wrapper">
      <div class="veui-page-info">
        <span class="veui-page-total">共 {{ pageTotal }} 条</span>
        <span class="veui-page-size">
          每页显示
          <select v-model="realPageSize">
            <option v-for="item in optionalPageSizes" :value="item">{{ item }}</option>
          </select>
        </span>
      </div>
      <div class="veui-page-switch" @click="handleClick($event)">
        <ul class="veui-pages" :class="{['veui-page-digit-length-' + pageDigitLength]: true}">
          <li v-for="item in pageIndicatorSeries" :class="{
            'veui-active': item.pageNo === pageNo
          }">
            <router-link :to="item.href">{{ item.text }}</router-link>
            <!-- <a :href="item.href" :data-page-no="item.pageNo">{{ item.text }}</a> -->
          </li>
        </ul>
        <div class="veui-buttons">
          <div class="veui-group-previous">
            <a :href="pageNavHref.first.href" :data-page-no="pageNavHref.first.pageNo" class="veui-button-absolute">
              <icon name="chevron-circle-left"></icon>
            </a>
            <a :href="pageNavHref.previous.href" :data-page-no="pageNavHref.previous.pageNo" class="veui-button-relative">
              <icon name="chevron-left"></icon>
            </a>
          </div>
          <div class="veui-group-next">
            <a :href="pageNavHref.next.href" :data-page-no="pageNavHref.next.pageNo" class="veui-button-relative">
              <icon name="chevron-right"></icon>
            </a>
            <a :href="pageNavHref.last.href" :data-page-no="pageNavHref.last.pageNo" class="veui-button-absolute">
              <icon name="chevron-circle-right"></icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './Icon'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/chevron-circle-left'
import 'vue-awesome/icons/chevron-circle-right'
import {closest} from '../utils/dom'

const LAYOUTS = [
  'basic',
  'hetero',
  'advanced',
  'full',
  'slim'
]

const OPTIONAL_PAGE_SIZES = [
  30, 60, 100, 200
]

const HREF_TPL_PLACEHOLDER = /\$page\b/g

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
    Icon
  },
  props: {
    pageNo: {
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
    hrefTpl: {
      type: String,
      default: '$page'
    },
    ui: {
      type: String,
      default () {
        return LAYOUTS[0]
      },
      validator (val) {
        // 有且只有一个有效 layout
        return val.trim().split(/\s+/).filter(function (item) {
          return LAYOUTS.indexOf(item) >= 0
        }).length === 1
      }
    }
  },
  data () {
    return {
      customPageSize: 0,
      optionalPageSizes: OPTIONAL_PAGE_SIZES
    }
  },
  computed: {
    pageNavHref () {
      return {
        first: this.getPageIndicator(1),
        last: this.getPageIndicator(this.pageCount),
        previous: this.getPageIndicator(Math.max(1, this.pageNo - 1)),
        next: this.getPageIndicator(Math.min(this.pageCount, this.pageNo + 1))
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
      let {pageNo, pageCount, getPageIndicator} = this

      let continuousIndicatorLength = aroundIndicatorLength * 2 + 1
      let boundaryIndicatorLength = (pageIndicatorLength - continuousIndicatorLength - 2) / 2

      let leftLen
      let rightLen
      let offsetBackward = Math.max(pageNo - moreIndicatorOffsetLength, 1)
      let offsetForward = Math.min(pageNo + moreIndicatorOffsetLength, pageCount)

      switch (true) {
        case pageCount <= pageIndicatorLength:
          return getPageSeries(1, pageCount)

        case pageNo < continuousIndicatorLength:
          leftLen = Math.max(continuousIndicatorLength, pageNo + aroundIndicatorLength)
          rightLen = pageIndicatorLength - leftLen - 1
          return getPageSeries(1, leftLen)
            .concat(getPageIndicator(offsetForward, true))
            .concat(getPageSeries(pageCount - rightLen + 1, rightLen))

        case pageNo > pageCount - continuousIndicatorLength + 1:
          rightLen = Math.max(pageCount - pageNo + 1 + aroundIndicatorLength, continuousIndicatorLength)
          leftLen = pageIndicatorLength - rightLen - 1
          return getPageSeries(1, leftLen)
            .concat(getPageIndicator(offsetBackward, true))
            .concat(getPageSeries(pageCount - rightLen + 1, rightLen))

        default:
          return getPageSeries(1, boundaryIndicatorLength)
            .concat(getPageIndicator(offsetBackward, true))
            .concat(getPageSeries(pageNo - boundaryIndicatorLength - 1, continuousIndicatorLength))
            .concat(getPageIndicator(offsetForward, true))
            .concat(getPageSeries(pageCount, boundaryIndicatorLength))
      }

      function getPageSeries (fromPageNo, length) {
        let series = []
        for (let i = 0; i < length; i++) {
          series[i] = getPageIndicator(fromPageNo + i)
        }
        return series
      }
    },

    pageDigitLength () {
      return this.pageCount.toString(10).length
    }
  },
  methods: {
    handleClick (event) {
      let target = closest(event.target, 'a')
      if (!target) {
        return
      }
      let pageNo = parseInt(target.dataset.pageNo, 10)
      if (isNaN(pageNo)) {
        return
      }
      this.$emit('redirect', {pageNo, event})
    },

    getPageIndicator (pageNo, isMore = false) {
      return {
        pageNo: isMore ? null : pageNo,
        text: isMore ? '...' : pageNo,
        href: pageNo ? formatHref(this.hrefTpl, pageNo) : null
      }
    }
  }
}

function formatHref (hrefTpl, pageNo) {
  return hrefTpl.replace(HREF_TPL_PLACEHOLDER, pageNo)
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

  color: @veui-gray-color-normal;
  font-weight: normal;

  a {
    color: inherit;
    text-decoration: none;
  }

  .veui-wrapper {
    .clearfix();
  }

  .veui-page-info {
    float: left;
    margin-right: @button-gap-width * 2;
    line-height: @digit-height;
  }

  .veui-page-size {
    margin-left: @button-gap-width;

  }

  .veui-page-switch {
    float: left;
  }

  .veui-buttons {
    float: left;

    [class|="veui-group"] {
      float: left;
    }

    [class|="veui-button"] {
      float: left;
      width: @button-width;
      height: @button-height;
      line-height: @button-width - 2px;
      text-align: center;
      background-color: @veui-gray-color-sup-2;
    }
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
    }

    .veui-active {
      color: @veui-gray-color-strong;
      font-weight: bold;
      background-color: @veui-gray-color-sup-2;
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

  .veui-group-shadow() {
    border-radius: 3px;
    background-color: @veui-gray-color-sup-5;
    box-shadow: 1px 1px 3px @veui-gray-color-weak;
  }

  &[ui~="basic"],
  &[ui~="slim"],
  &[ui~="advanced"] {
    .veui-page-switch {
      padding: 0 @button-width + @button-gap-width;
      position: relative;
    }

    .veui-buttons {
      [class|="veui-group"] {
        position: absolute;
        .veui-group-shadow();
      }
      .veui-group-previous {
        left: 0;
      }
      .veui-group-next {
        right: 0;
      }
    }
  }

  &[ui~="basic"],
  &[ui~="hetero"],
  &[ui~="slim"],
  &[ui~="full"] {
    .veui-buttons .veui-button-absolute {
      display: none;
    }
  }

  &[ui~="basic"],
  &[ui~="hetero"],
  &[ui~="slim"],
  &[ui~="advanced"] {
    .veui-page-info {
      display: none;
    }
  }

  &[ui~="advanced"] {
    .veui-page-switch {
      padding: 0 @button-width * 2 + @button-gap-width;
    }
    .veui-group-previous {
      .veui-button-relative {
        margin-left: 1px;
      }
    }
    .veui-group-next {
      .veui-button-relative {
        margin-right: 1px;
      }
    }
  }

  &[ui~="hetero"],
  &[ui~="full"] {
    .veui-buttons {
      margin-left: @button-gap-width;
      .veui-group-shadow();
    }
    .veui-group-previous {
      .veui-button-relative {
        margin-right: 1px;
      }
    }
  }

  &[ui~="slim"] {
    @scale-ratio: 0.55;

    .veui-page-switch {
      padding: 0 (@button-width + @button-gap-width) * @scale-ratio;

      li {
        width: @digit-width * @scale-ratio;
        height: @digit-height * @scale-ratio;
        line-height: @digit-height * @scale-ratio;
        font-size: 13px;
      }

      .veui-active {
        background: transparent;
      }
    }

    .veui-buttons {
      [class|="veui-group"] {
        box-shadow: none;
      }
      [class|="veui-button"] {
        width: @button-height * .55;
        height: @button-height * .55;
        line-height: 1.5;
        border: 1px solid @veui-gray-color-normal;
        border-radius: @button-width;
        color: @veui-gray-color-normal;
        background: transparent;

        svg {
          width: @button-height * .2;

          path {
            fill: currentColor;
          }
        }
      }
    }

    .generate-responsive-page-digit-width(4, .8);

  }

}
</style>
