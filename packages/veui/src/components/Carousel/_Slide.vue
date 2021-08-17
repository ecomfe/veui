<template>
<ol
  :class="{
    [$c('carousel-items')]: true,
    [$c('carousel-items-slide')]: true,
    [$c('carousel-items-vertical')]: vertical
  }"
  @transitionend="loopFix"
>
  <li
    v-for="item in realDatasource"
    ref="item"
    :key="item.key"
    :class="{
      [$c('carousel-item')]: true,
      [$c('carousel-item-duplicate')]: item.duplicate,
      [$c('carousel-item-pad')]: item.pad,
      [$c('carousel-item-current')]: showIndexes.indexOf(item.index) >= 0
    }"
    :style="dimension"
    tabindex="0"
    @focusin="focusedIndex = item.index"
    @focusout="focusedIndex = null"
  >
    <slot
      v-if="
        !item.pad &&
          (showIndexes.indexOf(item.index) >= 0 || isPreload(item.index))
      "
      name="item"
      v-bind="{ ...item.raw, preload: isPreload(item.index) }"
      :index="item.index"
    >
      <div
        :class="$c('carousel-item-image')"
        :style="{
          ...aspectRatioStyle,
          'background-image': `url(${item.raw.src})`
        }"
      >
        <img
          :class="$c('sr-only')"
          :src="item.raw.src"
          :alt="item.raw.alt"
        >
      </div>
    </slot>
  </li>
</ol>
</template>

<script>
import carousel from './mixin'

const CUSTOM_GUTTER = '--dls-carousel-gutter'

export const Props = {
  showCount: {
    type: Number,
    default: 1
  },
  stepCount: {
    type: Number,
    default: 1
  },
  vertical: Boolean
}

export default {
  name: 'veui-carousel-slide',
  mixins: [carousel],
  props: Props,
  data () {
    return {
      // 比如 index 是 0~3，那么 loopPage 是 -1~4， -1过渡完变成3，4过渡完变成0，形成循环
      loopPage: null
    }
  },
  computed: {
    maxPage () {
      // 最后一页（非 duplicate）满足：maxPage * stepCount + stepCount >= datasource.length
      return Math.ceil(this.datasource.length / this.stepCount - 1)
    },
    pageCount () {
      return this.maxPage + 1
    },
    hasGutter () {
      return !!(this.showCount - 1)
    },
    padCount () {
      const nextDupPageNo = this.maxPage + 1
      return this.datasource.length % this.stepCount
        ? nextDupPageNo * this.stepCount - this.datasource.length
        : 0
    },
    dimension () {
      const gutterCount = this.showCount - 1
      const dimension = this.vertical ? 'height' : 'width'
      return {
        [dimension]: gutterCount
          ? `calc((100% - var(${CUSTOM_GUTTER}) * ${gutterCount}) / ${this.showCount})`
          : '100%'
      }
    },
    normalizedDatasource () {
      let normalized = this.datasource.map((raw, index) => ({
        raw,
        index,
        key: `i#${raw.src}`
      }))

      // 补齐 pad 空白
      if (this.padCount) {
        let paddCount = this.padCount
        let len = this.datasource.length
        while (paddCount--) {
          normalized.push({
            pad: true,
            index: len + paddCount,
            key: `pad#${paddCount}`
          })
        }
      }
      return normalized
    },
    realDatasource () {
      let normalized = this.normalizedDatasource
      let len = this.datasource.length
      if (!len) {
        return this.normalizedDatasource
      }

      // 补上 duplicate，作用：
      //  1. wrap 时实现循环
      //  2. 作为非空白 pad，虽然 normalize 时补上了 pad，但是对于（总共5个，每页2个，每次滚动1个），就不用补空白 pad，而是非空白 pad 效果更好
      //  3. 始终有 duplicate，使得计算偏移的逻辑统一
      const startDups = normalized.slice(0, this.showCount).map(dup => ({
        ...dup,
        duplicate: true,
        key: `ds#${dup.key}`
      }))
      const endDups = normalized.slice(-this.stepCount).map(dup => ({
        ...dup,
        duplicate: true,
        key: `de#${dup.key}`
      }))
      return [...endDups, ...normalized, ...startDups]
    },
    showIndexes () {
      let idxes = []
      let sc = this.showCount
      let len = this.normalizedDatasource.length
      let start = this.index * this.stepCount
      while (sc--) {
        idxes.push((start + sc + len) % len)
      }
      return idxes
    },

    realLoopPage () {
      if (this.loopPage == null) {
        return null
      }

      return (this.loopPage + this.pageCount) % this.pageCount
    }
  },
  watch: {
    index (val) {
      if (val === this.realLoopPage) {
        return
      }
      this.setTransition(this.index)
    },
    vertical () {
      this.setTransition(this.index, 0)
    }
  },
  mounted () {
    this.setTransition(this.index, 0)
  },
  methods: {
    setTransition (loopPage, duration) {
      this.loopPage = loopPage
      const count = (this.stepCount / this.showCount) * (loopPage + 1)
      let offset = `calc((-100% ${
        this.hasGutter ? `- var(${CUSTOM_GUTTER})` : ''
      }) * ${count})`
      // duration 可能 0 表示立即转到，否则让 CSS 中设置生效
      this.$el.style.transitionDuration = duration == null ? '' : `${duration}s`
      this.$el.style.transform = `translate3d(${
        this.vertical ? `0,${offset},0` : `${offset},0,0`
      })`
    },
    loopFix () {
      if (this.index === this.realLoopPage && this.index !== this.loopPage) {
        this.setTransition(this.index, 0)
      }
    },
    stepSlide (step) {
      if (this.index === this.realLoopPage && this.index !== this.loopPage) {
        this.loopFix()
        this.$nextTick(() => {
          this.setTransition(this.index + step)
          this.doStep(step)
          let oldRealIndex = this.realIndex
          this.$nextTick(() => {
            if (oldRealIndex === this.realIndex) {
              this.cancelTransition()
            }
          })
        })
      } else {
        this.setTransition(this.index + step)
        this.doStep(step)
        let oldRealIndex = this.realIndex
        this.$nextTick(() => {
          if (oldRealIndex === this.realIndex) {
            this.cancelTransition()
          }
        })
      }
    },
    doStep (delta, focus) {
      if (
        !this.wrap &&
        (this.realIndex + delta < 0 || this.realIndex + delta > this.maxPage)
      ) {
        return
      }

      this.triggerChange(
        (this.realIndex + delta + this.pageCount) % this.pageCount
      )

      if (focus) {
        this.focusCurrent()
      }
    },
    cancelTransition () {
      this.setTransition(this.index, 0)
    }
  }
}
</script>
