import prefix from '../../mixins/prefix'
import { get, noop } from 'lodash'

export const CUSTOM_GUTTER = '--dls-carousel-slide-gutter'
export const FALLBACK_GUTTER = '24px'

export default {
  mixins: [prefix],
  props: {
    slideAspectRatio: [String, Number],
    options: Object,
    preloadRange: Array,
    datasource: Array,
    index: Number
  },
  created () {
    // 过渡完成后重置视频时间
    this.willReset = []
  },
  computed: {
    aspectRatioStyle () {
      if (this.slideAspectRatio) {
        return { 'padding-top': `${getRatio(this.slideAspectRatio) * 100}%` }
      }
      return null
    },
    isAutoplay () {
      return !!get(this.options, 'video.autoplay')
    },
    realDatasource () {
      return this.datasource
    }
  },
  methods: {
    resetVideos () {
      if (this.willReset.length) {
        this.willReset.forEach(ref => {
          // video 都是在循环里面
          if (this.$refs[ref] && this.$refs[ref][0]) {
            this.$refs[ref][0].currentTime = 0
          }
        })
        this.willReset = []
      }
    },
    pauseVideos (range) {
      if (typeof range === 'number') {
        range = [range, range + 1]
      }
      let [start, end] = range
      while (start < end) {
        const current = this.realDatasource[start]
        const ref = `video#${start}`
        if (isVideo(current) && this.$refs[ref] && this.$refs[ref][0]) {
          this.$refs[ref][0].pause()
          this.willReset.push(ref)
        }
        start++
      }
    },
    playVideos (range) {
      if (typeof range === 'number') {
        range = [range, range + 1]
      }
      let [start, end] = range
      while (start < end) {
        const current = this.realDatasource[start]
        if (isVideo(current)) {
          const video = this.$refs[`video#${start}`]
          if (video && video[0] && this.isAutoplay) {
            const playPro = video[0].play()
            if (playPro.catch) {
              // play 可能会报错（被 pause 中断等？）先 ignore，DOMException？
              playPro.catch(noop)
            }
          }
        }
        start++
      }
    },
    isPreload (index) {
      let [start, end] = this.preloadRange
      return start <= end
        ? index >= start && index <= end
        : index >= start || index <= end
    }
  }
}

export function isVideo ({ type, raw }) {
  return type === 'video' || (!!raw && raw.type === 'video')
}

export function getRatio (ratio) {
  if (typeof ratio === 'string') {
    const [w, h] = ratio.split('/').map(Number)
    ratio = h / w
  } else {
    ratio = 1 / ratio
  }
  return ratio
}
