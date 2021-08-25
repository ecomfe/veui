import prefix from '../../mixins/prefix'
import { get, noop } from 'lodash'

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
        let ratio = this.slideAspectRatio
        if (typeof ratio === 'string') {
          const [w, h] = ratio.split('/').map(Number)
          ratio = h / w
        } else {
          ratio = 1 / ratio
        }
        return { 'padding-top': `${ratio * 100}%` }
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
        if (isVideo(current)) {
          const ref = `video#${start}`
          const video = this.$refs[ref][0]
          video.pause()
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
          const video = this.$refs[`video#${start}`][0]
          if (this.isAutoplay) {
            const playPro = video.play()
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
