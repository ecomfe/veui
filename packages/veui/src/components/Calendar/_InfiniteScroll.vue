<script>
export default {
  name: 'veui-infinte-scroll',
  props: {
    notable: {
      type: Number
    },
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      default: 1
    },
    current: {
      type: Number
    }
  },
  data () {
    return {
      page: 0
    }
  },
  computed: {
    realRow () {
      let rest = this.row % 3
      return rest ? this.row + 3 - rest : this.row
    },
    realCount () {
      return this.realRow * this.col
    },
    start () {
      let rest = (this.current - this.notable) % this.realCount
      let origin = this.current - rest
      let oneOfThird = this.realCount / 3
      let sign = rest < oneOfThird ? -1 : rest > oneOfThird * 2 ? 1 : 0
      origin += oneOfThird * sign
      return origin + this.page * oneOfThird
    }
  },
  methods: {
    handleScroll () {
      let { scrollTop, scrollHeight, clientHeight } = this.$el
      let max = scrollHeight - clientHeight
      if (!scrollTop) {
        this.page--
        this.$el.scrollTop = max / 3
      } else if (scrollTop === max) {
        this.page++
        this.$el.scrollTop = (max / 3) * 2
      }
    }
  },
  render (h) {
    return this.$scopedSlots['default']({
      listeners: {
        scroll: this.handleScroll
      },
      data: {
        start: this.start,
        row: this.realRow,
        page: this.page
      }
    })
  }
}
</script>
