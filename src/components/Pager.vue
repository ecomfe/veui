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
        <ul class="veui-pages">
          <li v-for="item in pageIndicatorSeries" :class="{
            'veui-active': item.pageNo === pageNo
          }">
            <a v-if="item.pageNo" :href="item.href" :data-page-no="item.pageNo">{{ item.pageNo }}</a>
            <span v-else>…</span>
          </li>
        </ul>
        <div class="veui-buttons">
          <div class="veui-group-previous">
            <a :href="pageNavHref.first.href" :data-page-no="pageNavHref.first.pageNo" class="veui-button-absolute">
              <icon name="fa-chevron-circle-left"></icon>
            </a>
            <a :href="pageNavHref.previous.href" :data-page-no="pageNavHref.previous.pageNo" class="veui-button-relative">
              <icon name="fa-chevron-left"></icon>
            </a>
          </div>
          <div class="veui-group-next">
            <a :href="pageNavHref.next.href" :data-page-no="pageNavHref.next.pageNo" class="veui-button-relative">
              <icon name="fa-chevron-right"></icon>
            </a>
            <a :href="pageNavHref.last.href" :data-page-no="pageNavHref.last.pageNo" class="veui-button-absolute">
              <icon name="fa-chevron-circle-right"></icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './Icon'
import 'vue-awesome/icons/fa-chevron-left'
import 'vue-awesome/icons/fa-chevron-right'
import 'vue-awesome/icons/fa-chevron-circle-left'
import 'vue-awesome/icons/fa-chevron-circle-right'

const LAYOUTS = [
  'basic',
  'hetero',
  'advanced',
  'full'
]

const OPTIONAL_PAGE_SIZES = [
  30, 60, 100, 200
]

const PAGE_INDICATOR_COUNT = 7
const HREF_TPL_PLACEHOLDER = /\$page\b/g

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
        first: getPage(this.hrefTpl, 1),
        last: getPage(this.hrefTpl, this.pageCount),
        previous: getPage(this.hrefTpl, Math.max(1, this.pageNo - 1)),
        next: getPage(this.hrefTpl, Math.min(this.pageCount, this.pageNo + 1))
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
      let {hrefTpl, pageNo, pageCount} = this

      let series = []
      let halfPageIndicatorCount = Math.floor(PAGE_INDICATOR_COUNT / 2)

      if (pageCount <= PAGE_INDICATOR_COUNT) {
        for (let i = pageCount; i > 0; i--) {
          series[i - 1] = getPage(hrefTpl, i)
        }
      } else if (pageNo <= halfPageIndicatorCount || pageNo + halfPageIndicatorCount > pageCount) {
        for (let i = 0; i < halfPageIndicatorCount; i++) {
          series[i] = getPage(hrefTpl, i + 1)
        }
        series[halfPageIndicatorCount] = getPage()
        for (let i = 1; i <= halfPageIndicatorCount; i++) {
          series[i + halfPageIndicatorCount] = getPage(hrefTpl, pageCount - halfPageIndicatorCount + i)
        }
      } else {
        series[0] = getPage()
        series[PAGE_INDICATOR_COUNT - 1] = getPage()
        for (let i = 1; i < PAGE_INDICATOR_COUNT - 1; i++) {
          series[i] = getPage(hrefTpl, pageNo - halfPageIndicatorCount + i)
        }
      }

      return series
    }
  },
  methods: {
    handleClick (event) {
      let target = event.target
      if (target.tagName.toUpperCase() !== 'A') {
        return
      }
      let pageNo = parseInt(target.dataset.pageNo, 10)
      if (isNaN(pageNo)) {
        return
      }
      this.$emit('redirect', {pageNo, event})
    }
  }
}

function getPage (hrefTpl, pageNo) {
  return {
    pageNo,
    href: pageNo ? formatHref(hrefTpl, pageNo) : null
  }
}

function formatHref (hrefTpl, pageNo) {
  return hrefTpl.replace(HREF_TPL_PLACEHOLDER, pageNo)
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-pager {
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
  }

  .veui-page-size {
    margin-left: 1.2em;

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
      display: block;
      padding: 5px 8px 3px;
    }
  }

  .veui-pages {
    float: left;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      float: left;
      margin: 0 2px;
      padding: 5px 8px 3px;
    }

    .veui-active {
      color: @veui-gray-color-strong;
      background-color: @veui-gray-color-sup-2;
    }

    span {
      color: @veui-gray-color-weak;
    }
  }

  .veui-group-bg() {
    border-radius: 3px;
    background-color: @veui-gray-color-sup-2;
    box-shadow: 1px 1px 3px @veui-gray-color-weak;
  }

  &[ui~="basic"],
  &[ui~="advanced"] {
    .veui-page-switch {
      padding: 0 2.4em;
      position: relative;
    }

    .veui-buttons {
      [class|="veui-group"] {
        position: absolute;
        .veui-group-bg();
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
  &[ui~="full"] {
    .veui-buttons .veui-button-absolute {
      display: none;
    }
  }

  &[ui~="basic"],
  &[ui~="hetero"],
  &[ui~="advanced"] {
    .veui-page-info {
      display: none;
    }
  }

  &[ui~="advanced"] {
    .veui-page-switch {
      padding: 0 4.8em;
    }
    .veui-group-previous {
      .veui-button-relative {
        border-left: 1px solid @veui-gray-color-sup-5;
      }
    }
    .veui-group-next {
      .veui-button-relative {
        border-right: 1px solid @veui-gray-color-sup-5;
      }
    }
  }

  &[ui~="hetero"],
  &[ui~="full"] {
    .veui-buttons {
      .veui-group-bg();
    }
    .veui-group-previous {
      .veui-button-relative {
        border-right: 1px solid @veui-gray-color-sup-5;
      }
    }
  }

  &[ui~="full"] {
    .veui-page-switch {
      margin-left: 2.4em;
    }
  }

}
</style>
