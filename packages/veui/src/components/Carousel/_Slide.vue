<template>
<ol
  :class="{
    [$c('carousel-items')]: true,
    [$c('carousel-items-slide')]: true,
    [$c('carousel-items-vertical')]: vertical
  }"
  @transitionend.self="handleTransitionEnd"
  @transitioncancel.self="handleTransitionEnd"
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
          :alt="item.raw.alt"
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
import carousel, { isVideo, CUSTOM_GUTTER, FALLBACK_GUTTER } from './mixin'
import { get } from 'lodash'

// index 解释
// 1. prop index 其实是 view 的 index，即 groupIndex
// 2. local loopGroupIndex, 在 groupIndex 上填上了 -1 和 length，方便循环
// 3. index in realDatasource, rdIndex，循环时候的 offset
// 4. index in datasource, dIndex，实际预加载等感知的 index

export const props = {
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
  props,
  data () {
    return {
      // 比如 index 是 0~3，那么 loopGroupIndex 是 -1~4， -1过渡完变成3，4过渡完变成0，形成循环
      loopGroupIndex: this.index,
      oldIndex: this.index
    }
  },
  computed: {
    groupCount () {
      return Math.ceil(this.datasource.length / this.slidesPerGroup)
    },
    hasGutter () {
      return !!(this.slidesPerView - 1)
    },
    dimension () {
      const gutterCount = this.slidesPerView - 1
      if (!gutterCount) {
        return getDimension(this.vertical)
      }
      return [
        getDimension(
          this.vertical,
          FALLBACK_GUTTER,
          gutterCount,
          this.slidesPerView
        ),
        getDimension(
          this.vertical,
          `var(${CUSTOM_GUTTER})`,
          gutterCount,
          this.slidesPerView
        )
      ]
    },
    /**
     * 空白 pad 的数量
     */
    padCount () {
      const nextDupPageNo = this.groupCount
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
        let padCount = this.padCount
        let len = this.datasource.length
        while (padCount--) {
          normalized.push({
            pad: true,
            index: len + padCount,
            key: `pad#${padCount}`
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
          key: `ds#${real.key}`
        }
        return dup
      })
      const endDups = normalized.slice(-this.slidesPerGroup).map(real => {
        const dup = {
          ...real,
          duplicate: true,
          key: `de#${real.key}`
        }
        return dup
      })

      return [...endDups, ...normalized, ...startDups]
    },
    currentRdIndexes () {
      let indexes = []
      let sc = this.slidesPerView
      const start = (this.loopGroupIndex + 1) * this.slidesPerGroup
      while (sc--) {
        indexes.push(start + sc)
      }
      return indexes
    },
    groupIndex () {
      return (this.loopGroupIndex + this.groupCount) % this.groupCount
    },
    needFixLoop () {
      return (
        this.index === this.groupIndex && this.index !== this.loopGroupIndex
      )
    },
    transitionRdIndexRange () {
      if (this.oldIndex != null && this.oldIndex !== this.index) {
        let [oldStart, oldEnd] = this.getRdIndexesByLoopGroupIndex(
          this.oldIndex
        )
        let [start, end] = this.getRdIndexesByLoopGroupIndex(this.index)
        return [Math.min(oldStart, start), Math.max(oldEnd, end)]
      }
      return null
    }
  },
  watch: {
    index (val, oldVal) {
      this.oldIndex = oldVal
      if (val === this.groupIndex) {
        return
      }
      this.inTransition = true
      // 暂停即将滑动出去的
      this.pauseVideoForSlideOuts(oldVal, val)
      this.setTransition(this.index)
    },
    vertical () {
      this.setTransition(this.index, true)
    }
  },
  created () {
    this.inTransition = false
    this.renderedItems = []
  },
  mounted () {
    this.setTransition(this.index, true)
  },
  methods: {
    shouldRenderItem ({ pad, index: dIndex }, index) {
      if (pad) {
        return false
      }
      // 已经渲染的继续渲染
      if (this.renderedItems.indexOf(index) >= 0) {
        return true
      }

      // 当前 or 预加载需要将项目渲染出来
      let result =
        this.currentRdIndexes.indexOf(index) >= 0 || this.isPreload(dIndex)

      // 移动经过的也渲染
      if (!result && this.transitionRdIndexRange) {
        const [start, end] = this.transitionRdIndexRange
        result = start <= index && index < end
      }

      // 当需要 fixLoop 时，将修复目标的 view 也渲染出来
      if (!result && this.needFixLoop) {
        const [start, end] = this.getRdIndexesByLoopGroupIndex(this.groupIndex)
        result = start <= index && index < end
      }

      if (result) {
        this.renderedItems.push(index)
      }
      return result
    },
    pauseVideoForSlideOuts (fromLoopGroupIndex, toLoopGroupIndex) {
      return this.pauseVideos(
        this.getSlideOutRange(fromLoopGroupIndex, toLoopGroupIndex)
      )
    },
    playVideoForSlideIns (loopGroupIndex) {
      return this.playVideos(this.getRdIndexesByLoopGroupIndex(loopGroupIndex))
    },
    setTransition (loopGroupIndex, immediate) {
      this.loopGroupIndex = loopGroupIndex
      const count =
        (this.slidesPerGroup / this.slidesPerView) * (loopGroupIndex + 1)
      this.inTransition = !immediate
      this.$el.style.transitionDuration = immediate ? '0s' : '' // 让 CSS 中设置生效
      // 先设置 fallback 再设置 custom 语法
      this.$el.style.transform = getTranslate(
        this.hasGutter ? FALLBACK_GUTTER : '',
        count,
        this.vertical
      )
      this.$el.style.transform = getTranslate(
        this.hasGutter ? `var(${CUSTOM_GUTTER})` : '',
        count,
        this.vertical
      )
    },
    // 从 duplidate group 切换到实际的
    loopFix () {
      // 从 duplicate 同步时间并播放
      this.syncVideoCurrentTimeOnLoopFix()
      // 暂停 duplicate
      this.pauseVideoForSlideOuts(this.loopGroupIndex, this.index)
      // 立即切换
      this.setTransition(this.index, true)
      // 重置 duplicate
      this.resetVideos()
    },
    // loopFix 时将调整
    syncVideoCurrentTimeOnLoopFix () {
      const offset = (this.index - this.loopGroupIndex) * this.slidesPerGroup
      let [start, end] = this.getRdIndexesByLoopGroupIndex(this.loopGroupIndex)
      const [preserveStart, preserveEnd] =
        this.loopGroupIndex === -1
          ? [this.slidesPerGroup, this.slidesPerView]
          : [start, end - this.slidesPerGroup]
      while (start < end) {
        let item = this.realDatasource[start]
        if (isVideo(item)) {
          const duplicate = get(this.$refs, `video#${start}[0]`)
          const target = get(this.$refs, `video#${start + offset}[0]`)
          // slot 被覆盖了就什么也取不到了，检查下
          if (duplicate && target) {
            target.currentTime = duplicate.currentTime
            if (preserveStart <= start && start < preserveEnd) {
              if (!duplicate.paused) {
                target.play()
              }
            } else if (this.isAutoplay) {
              target.play()
            }
          }
        }
        start++
      }
    },
    // public
    goToGroup (newIndex) {
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
    doStep (delta) {
      const oldIndex = this.index
      const newLoopGroupIndex = this.index + delta
      const newIndex = (newLoopGroupIndex + this.groupCount) % this.groupCount

      // 数据同步
      this.$emit('update:index', newIndex)
      // 开始过渡到新view
      this.setTransition(newLoopGroupIndex)
      // 暂停即将滑动出去的
      this.pauseVideoForSlideOuts(oldIndex, newLoopGroupIndex)
      // 受控检查 TODO
      this.$nextTick(() => {
        if (newIndex !== this.index) {
          this.setTransition(this.index, true)
          // play?
        }
      })
    },
    // public
    step (delta) {
      if (this.inTransition) {
        return
      }
      this.resetVideos()
      if (this.needFixLoop) {
        this.loopFix()
      }
      this.doStep(delta)
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
    // 获取将要滚动出去的索引（并非 view 中所有项目都会滚动出去）
    getSlideOutRange (fromLoopGroupIndex, toLoopGroupIndex) {
      const [fromStart, fromEnd] = this.getRdIndexesByLoopGroupIndex(
        fromLoopGroupIndex
      )
      const [toStart, toEnd] = this.getRdIndexesByLoopGroupIndex(
        toLoopGroupIndex
      )
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
    // 获取当前 group 在 realDatasource 中的索引
    getRdIndexesByLoopGroupIndex (loopGroupIndex) {
      let start = (loopGroupIndex + 1) * this.slidesPerGroup
      return [start, start + this.slidesPerView]
    }
  }
}

function getTranslate (gutter, count, vertical) {
  let calc = `calc((-100%${gutter ? ` - ${gutter}` : ''}) * ${count})`
  return `translate3d(${vertical ? `0,${calc},0` : `${calc},0,0`})`
}

function getDimension (vertical, gutter, gutterCount, slidesPerView) {
  const dimension = vertical ? 'height' : 'width'
  const content = gutterCount
    ? `calc((100% - ${gutter} * ${gutterCount}) / ${slidesPerView})`
    : '100%'
  return { [dimension]: content }
}
</script>
