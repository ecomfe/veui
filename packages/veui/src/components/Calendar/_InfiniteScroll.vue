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
    realRow () {
      let rest = this.row % 3
      return rest ? this.row + 3 - rest : this.row
    },
    realCount () {
      return this.realRow * this.col
    },
    start () {
      let rest = (this.initial - this.notable) % this.realCount
      let origin = this.initial - rest
      let unit = this.realCount / 3
      let sign = rest < unit ? -1 : rest > unit * 2 ? 1 : 0
      origin += unit * sign
      return origin + this.page * unit
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
    return this.$scopedSlots.default({
      onscroll: this.handleScroll,
      start: this.start,
      row: this.realRow,
      page: this.page
    })
  }
}
</script>
