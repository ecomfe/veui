export default {
  data () {
    return {
      openForDesc: false,
      currentForDesc: null
    }
  },
  methods: {
    handleEnterForDesc (item) {
      if (item.desc || this.$scopedSlots.desc || this.$slots.desc) {
        // 不能用字符串 ref，因为字符串不变，但是 Button 在切换 disabled 时 dom 会变化
        // 在切换 target 时，popover 是无法通过 hover 来自动 open 的，所以手动要 open
        this.openForDesc = true
        this.currentForDesc = item
      } else {
        this.openForDesc = false
        this.currentForDesc = null
      }
    }
  }
}
