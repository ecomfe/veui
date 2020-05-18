<script>
import { scrollToAlign } from '../../utils/dom'

export default {
  name: 'veui-infinte-scroll',
  props: {
    // 表示一个典型的起点，如 (notable=1901, row=50, col=3) 表示 [1901, 2050]是一个区间，其他任何年份可以通过该区间翻页得到
    // 保证多列布局时每个年份的位置时可以定制的（如1901, 1904, ...一直在第一列）
    notable: {
      type: Number,
      default: 1901
    },
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      default: 1
    },
    // 通过计算找到一个区间使得 initial 处于该区间的中部，并定义该区间处于 page=0 。
    initial: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      page: 0
    }
  },
  computed: {
    // 每次跳页时更新的行数
    rowsPerPage () {
      return Math.round(this.row / 3)
    },
    countsPerPage () {
      return this.rowsPerPage * this.col
    },
    totalCount () {
      return this.row * this.col
    },
    // 最初 page=0， 往上滚动加载一页（大致是 totalCount 的 1/3）时 page=-1，往下则是page=1，依次类推
    // startBase 为当 page=0 时的起点
    startBase () {
      let rest = (this.initial - this.notable) % this.totalCount
      let origin = this.initial - rest
      let sign =
        rest <= this.countsPerPage ? -1 : rest > this.countsPerPage * 2 ? 1 : 0
      return origin + this.countsPerPage * sign
    },
    start () {
      return this.startBase + this.page * this.countsPerPage
    }
  },
  watch: {
    initial () {
      this.page = 0
    }
  },
  mounted () {
    this.scrollToAlign(this.initial - this.start, 0.5)
  },
  methods: {
    handleScroll () {
      let { scrollTop, scrollHeight, clientHeight } = this.$el
      let max = scrollHeight - clientHeight
      if (!scrollTop) {
        this.page--
        this.$nextTick(() => this.restorePosition(false))
      } else if (scrollTop === max) {
        this.page++
        this.$nextTick(() => this.restorePosition(true))
      }
    },
    // 翻页之后尽量将之前的发生翻页的地方恢复到原来位置
    restorePosition (downward) {
      this.scrollToAlign(this.getEdgeIndex(downward), downward ? 1 : 0)
    },
    getEdgeIndex (downward) {
      return downward
        ? this.totalCount - this.countsPerPage - 1
        : this.countsPerPage + 1
    },
    scrollToAlign (index, position) {
      // 这个选择器需要用户放到对应的 item 上
      let target = this.$el.querySelector(`[data-index="${index}"]`)
      if (target) {
        scrollToAlign(this.$el, target, {
          targetPosition: position,
          viewportPosition: position,
          duration: 0
        })
      }
    }
  },
  render () {
    return this.$scopedSlots.default({
      onscroll: this.handleScroll,
      start: this.start,
      row: this.row,
      page: this.page
    })
  }
}
</script>
