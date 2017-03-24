<template>
  <div class="veui-pager">
    <div class="layout" :class="{['layout-' + layout]: true}">
      <div class="page-info">
        <span class="page-total">共 {{ pageTotal }} 条</span>
        <span class="page-size">
          每页显示
          <select v-model="realPageSize">
            <option v-for="item in optionalPageSizes" :value="item">{{ item }}</option>
          </select>
        </span>
      </div>
      <div class="page-switch" @click="handleClick($event)">
        <ul class="pages">
          <li v-for="item in pageIndicatorSeries" :class="{
            active: item.pageNo === pageNo,
            muted: !item.pageNo,
          }">
            <a :href="item.href" :data-page-no="item.pageNo">{{ item.text }}</a>
          </li>
        </ul>
        <div class="buttons">
          <div class="group group-previous">
            <a :href="pageNavHref.first.href" :data-page-no="pageNavHref.first.pageNo" class="button absolute">
              <icon name="fa-chevron-circle-left"></icon>
            </a>
            <a :href="pageNavHref.previous.href" :data-page-no="pageNavHref.previous.pageNo" class="button relative">
              <icon name="fa-chevron-left"></icon>
            </a>
          </div>
          <div class="group group-next">
            <a :href="pageNavHref.next.href" :data-page-no="pageNavHref.next.pageNo" class="button relative">
              <icon name="fa-chevron-right"></icon>
            </a>
            <a :href="pageNavHref.last.href" :data-page-no="pageNavHref.last.pageNo" class="button absolute">
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
const PAGE_INDICATOR_MORE = '...'
const HREF_TPL_PLACEHOLDER = '$page'

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
    layout: {
      type: String,
      default: LAYOUTS[0],
      validate (val) {
        return LAYOUTS.indexOf(val) >= 0
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
      let hrefTpl = this.hrefTpl

      let pageNo = this.pageNo
      let pageCount = this.pageCount

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
    text: pageNo || PAGE_INDICATOR_MORE,
    href: pageNo ? formatHref(hrefTpl, pageNo) : null
  }
}

function formatHref (hrefTpl, pageNo) {
  // TODO: 多处占位符的情况
  return hrefTpl.replace(HREF_TPL_PLACEHOLDER, pageNo)
}
</script>

<style lang="less">
@import "../styles/theme-default/lib.less";

.veui-pager {
  color: @veui-gray-color-normal;
  font-weight: normal;

  .layout {
    display: flex;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .page-size {
    margin-left: 1.2em;
  }

  .page-switch {
    display: flex;
  }

  .buttons {
    display: flex;

    .group {
      display: flex;
    }
    .button {
      display: block;
      padding: 5px 8px 3px;
    }
  }

  .pages {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;

    li {
      margin: 0 2px;
      padding: 5px 8px 3px;
    }

    .active {
      color: @veui-gray-color-strong;
      background-color: @veui-gray-color-sup-2;
    }
    .muted {
      color: @veui-gray-color-weak;
    }
  }

  .group-bg() {
    border-radius: 3px;
    background-color: @veui-gray-color-sup-2;
    box-shadow: 1px 1px 3px @veui-gray-color-weak;
  }

  .layout-basic,
  .layout-advanced {
    .page-switch {
      padding: 0 2.4em;
      position: relative;
    }

    .buttons {
      .group {
        position: absolute;
        .group-bg();
      }
      .group-previous {
        left: 0;
      }
      .group-next {
        right: 0;
      }
    }
  }

  .layout-basic,
  .layout-hetero,
  .layout-full {
    .buttons .absolute {
      display: none;
    }
  }

  .layout-basic,
  .layout-hetero,
  .layout-advanced {
    .page-info {
      display: none;
    }
  }

  .layout-advanced {
    .page-switch {
      padding: 0 4.8em;
    }
    .group-previous .relative {
      border-left: 1px solid @veui-gray-color-sup-5;
    }
    .group-next .relative {
      border-right: 1px solid @veui-gray-color-sup-5;
    }
  }

  .layout-hetero,
  .layout-full {
    .buttons {
      .group-bg();
    }
    .group-previous .relative {
      border-right: 1px solid @veui-gray-color-sup-5;
    }
  }

  .layout-full {
    .page-switch {
      margin-left: 2.4em;
    }
  }

}
</style>
