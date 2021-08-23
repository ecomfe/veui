<template>
<ol
  :class="{
    [$c('carousel-items')]: true,
    [$c('carousel-items-slide')]: true,
    [$c('carousel-items-vertical')]: vertical
  }"
  @transitionend="handleTransitionEnd"
>
  <li
    v-for="(item, rdIndex) in realDatasource"
    ref="item"
    :key="rdIndex"
    :class="{
      [$c('carousel-item')]: true,
      [$c('carousel-item-duplicate')]: item.duplicate,
      [$c('carousel-item-pad')]: item.pad,
      [$c('carousel-item-current')]: currentRdIndexes.indexOf(rdIndex) >= 0
    }"
    tabindex="-1"
    :style="dimension"
  >
    <slot
      v-if="shouldRenderItem(item, rdIndex)"
      name="item"
      v-bind="{ ...item.raw, preload: isPreload(item.index) }"
      :index="item.index"
    >
      <div
        :class="$c('carousel-item-media')"
        :style="{
          ...aspectRatioStyle,
          ...(item.raw.type !== 'video' && {
            'background-image': `url(${item.raw.src})`
          })
        }"
      >
        <video
          v-if="item.raw.type === 'video'"
          :ref="`video#${rdIndex}`"
          :class="$c('carousel-item-video')"
          :src="item.raw.src"
          preload="auto"
          tabindex="-1"
          v-bind="options.video"
          :autoplay="
            currentRdIndexes.indexOf(rdIndex) >= 0 && options.video.autoplay
          "
          :muted="isAutoplay || options.video.muted"
        />
        <img
          v-else
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
import carousel, { isVideo } from './mixin'

const CUSTOM_GUTTER = '--dls-carousel-gutter'
// index 解释
// 1. prop index 其实是 view 的 index，即 viewIndex
// 2. local loopViewIndex, 在 viewIndex 上填上了 -1 和 length，方便循环
// 3. index in realDatasource, rdIndex，循环时候的 offset
// 4. index in datasource, dIndex，实际预加载等感知的 index

export const Props = {
  slidesPerView: {
    type: Number,
    default: 1
  },
  slidesPerGroup: {
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
      // 比如 index 是 0~3，那么 loopViewIndex 是 -1~4， -1过渡完变成3，4过渡完变成0，形成循环
      loopViewIndex: this.index
    }
  },
  computed: {
    pageCount () {
      return Math.ceil(this.datasource.length / this.slidesPerGroup)
    },
    hasGutter () {
      return !!(this.slidesPerView - 1)
    },
    dimension () {
      const gutterCount = this.slidesPerView - 1
      const dimension = this.vertical ? 'height' : 'width'
      return {
        [dimension]: gutterCount
          ? `calc((100% - var(${CUSTOM_GUTTER}) * ${gutterCount}) / ${this.slidesPerView})`
          : '100%'
      }
    },
    /**
     * 空白 pad 的数量
     */
    padCount () {
      const nextDupPageNo = this.pageCount
      return this.datasource.length % this.slidesPerGroup
        ? nextDupPageNo * this.slidesPerGroup - this.datasource.length
        : 0
    },
    /**
     * datasource + pad 空白 + duplicate
     */
    realDatasource () {
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

      if (!normalized.length) {
        return normalized
      }

      // 补上 duplicate，作用：
      //  1. wrap 时实现循环
      //  2. 作为非空白 pad，虽然 normalize 时补上了 pad，但是对于（总共5个，每页2个，每次滚动1个），就不用补空白 pad，而是非空白 pad 效果更好
      //  3. 始终有 duplicate，使得计算偏移的逻辑统一
      const startDups = normalized.slice(0, this.slidesPerView).map(real => {
        const dup = {
          ...real,
          duplicate: true,
          real,
          key: `ds#${real.key}`
        }
        real.duplicates = real.duplicates ? [...real.duplicates, dup] : [dup]
        return dup
      })
      const endDups = normalized.slice(-this.slidesPerGroup).map(real => {
        const dup = {
          ...real,
          duplicate: true,
          real,
          key: `de#${real.key}`
        }
        real.duplicates = real.duplicates ? [...real.duplicates, dup] : [dup]
        return dup
      })

      return [...endDups, ...normalized, ...startDups]
    },
    currentRdIndexes () {
      let indexes = []
      let sc = this.slidesPerView
      const start = (this.loopViewIndex + 1) * this.slidesPerGroup
      while (sc--) {
        indexes.push(start + sc)
      }
      return indexes
    },
    adjustedLoopViewIndex () {
      return (this.loopViewIndex + this.pageCount) % this.pageCount
    },
    needFixLoop () {
      return (
        this.index === this.adjustedLoopViewIndex &&
        this.index !== this.loopViewIndex
      )
    }
  },
  watch: {
    index (val, oldVal) {
      if (val === this.adjustedLoopViewIndex) {
        return
      }
      this.inTransition = true
      // 暂停即将滑动出去的
      this.pauseVideoForSlideOuts(oldVal, val)
      this.setTransition(this.index)
    },
    vertical () {
      this.setTransition(this.index, 0)
    }
  },
  created () {
    this.inTransition = false
  },
  mounted () {
    this.setTransition(this.index, 0)
  },
  methods: {
    shouldRenderItem ({ pad, index: dIndex }, index) {
      // 当前 or 预加载需要将项目渲染出来
      if (pad) {
        return false
      }

      if (this.currentRdIndexes.indexOf(index) >= 0 || this.isPreload(dIndex)) {
        return true
      }

      // 当需要 fixLoop 时，将修复目标的 view 也渲染出来
      if (this.needFixLoop) {
        const [start, end] = this.getRdIndexesByLoopViewIndex(
          this.adjustedLoopViewIndex
        )
        if (start <= index && index < end) {
          return true
        }
      }
      return false
    },
    pauseVideoForSlideOuts (fromLoopViewIndex, toLoopViewIndex) {
      return this.pauseVideos(
        this.getSlideOutRange(fromLoopViewIndex, toLoopViewIndex)
      )
    },
    playVideoForSlideIns (loopViewIndex) {
      return this.playVideos(this.getRdIndexesByLoopViewIndex(loopViewIndex))
    },
    setTransition (loopViewIndex, duration) {
      this.loopViewIndex = loopViewIndex
      const count =
        (this.slidesPerGroup / this.slidesPerView) * (loopViewIndex + 1)
      let offset = `calc((-100% ${
        this.hasGutter ? `- var(${CUSTOM_GUTTER})` : ''
      }) * ${count})`
      // duration 可能 0 表示立即转到，否则让 CSS 中设置生效
      this.$el.style.transitionDuration = duration == null ? '' : `${duration}s`
      this.$el.style.transform = `translate3d(${
        this.vertical ? `0,${offset},0` : `${offset},0,0`
      })`
    },
    cancelTransition () {
      this.setTransition(this.index, 0)
      this.inTransition = false
    },
    loopFix () {
      // 从 duplicate 同步时间并播放
      this.syncVideoCurrentTimeOnLoopFix()
      // 暂停 duplicate
      this.pauseVideoForSlideOuts(this.loopViewIndex, this.index)
      // 立即切换
      this.setTransition(this.index, 0)
      // 重置 duplicate
      this.resetVideos()
    },
    syncVideoCurrentTimeOnLoopFix () {
      const offset = (this.index - this.loopViewIndex) * this.slidesPerGroup
      let [start, end] = this.getRdIndexesByLoopViewIndex(this.loopViewIndex)
      const [preserveStart, preserveEnd] =
        this.loopViewIndex === -1
          ? [this.slidesPerGroup, this.slidesPerView]
          : [start, end - this.slidesPerGroup]
      while (start < end) {
        let item = this.realDatasource[start]
        if (isVideo(item)) {
          const duplicate = this.$refs[`video#${start}`][0]
          const target = this.$refs[`video#${start + offset}`][0]
          target.currentTime = duplicate.currentTime
          if (preserveStart <= start && start < preserveEnd) {
            if (!duplicate.paused) {
              target.play()
            }
          } else if (this.isAutoplay) {
            target.play()
          }
        }
        start++
      }
    },
    goToView (newIndex) {
      this.resetVideos()
      if (this.needFixLoop) {
        this.loopFix()
      }
      if (newIndex !== this.index) {
        // 开始过渡到新view
        this.setTransition(newIndex)
        // 暂停即将滑动出去的
        this.pauseVideoForSlideOuts(this.index, newIndex)
      }
    },
    tryStepView (step) {
      this.inTransition = true
      const oldIndex = this.index
      const newLoopViewIndex = this.index + step
      const newIndex = (newLoopViewIndex + this.pageCount) % this.pageCount

      // 数据同步
      this.$emit('update:index', newIndex)
      // 开始过渡到新view
      this.setTransition(newLoopViewIndex)
      // 暂停即将滑动出去的
      this.pauseVideoForSlideOuts(oldIndex, newLoopViewIndex)
      // 受控检查 TODO
      this.$nextTick(() => {
        if (newIndex !== this.index) {
          this.cancelTransition()
          // play?
        }
      })
    },
    // public
    stepView (step) {
      if (this.inTransition) {
        return
      }
      this.resetVideos()
      if (this.needFixLoop) {
        this.loopFix()
      }
      this.tryStepView(step)
    },

    handleTransitionEnd () {
      this.inTransition = false
      this.resetVideos()
      if (this.needFixLoop) {
        this.loopFix()
      } else if (this.isAutoplay) {
        this.playVideoForSlideIns(this.index)
      }
    },
    focusCurrent (index) {
      this.$refs.item[index + 1].focus({ preventScroll: true })
    },
    getSlideOutRange (fromLoopViewIndex, toLoopViewIndex) {
      const [fromStart, fromEnd] = this.getRdIndexesByLoopViewIndex(
        fromLoopViewIndex
      )
      const [toStart, toEnd] = this.getRdIndexesByLoopViewIndex(toLoopViewIndex)
      let start = fromStart
      let end = fromEnd

      if (fromStart < toStart && toStart < fromEnd) {
        end = toStart
      }
      if (fromStart < toEnd && toEnd < fromEnd) {
        start = toEnd
      }
      return [start, end]
    },
    getRdIndexesByLoopViewIndex (loopViewIndex) {
      let start = (loopViewIndex + 1) * this.slidesPerGroup
      return [start, start + this.slidesPerView]
    }
  }
}
</script>
