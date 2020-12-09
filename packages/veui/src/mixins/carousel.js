import { contains } from '../utils/dom'
import prefix from '../mixins/prefix'
import ui from '../mixins/ui'
import i18n from '../mixins/i18n'
import useControllable from '../mixins/controllable'

const DEFAULT_LAZY_OPTIONS = {
  preload: 1
}
export default {
  mixins: [prefix, ui, i18n, useControllable(['index'])],
  props: {
    datasource: {
      type: Array,
      default () {
        return []
      }
    },
    index: {
      type: Number,
      default: 0
    },
    wrap: Boolean,
    lazy: {
      type: [Boolean, Object],
      default: false
    }
  },
  data () {
    return {
      focused: false,
      focusedIndex: null
    }
  },
  computed: {
    count () {
      return this.datasource.length
    },
    realLazy () {
      if (!this.lazy) {
        return false
      }
      if (this.lazy === true) {
        return DEFAULT_LAZY_OPTIONS
      }

      return {
        ...DEFAULT_LAZY_OPTIONS,
        ...this.lazy
      }
    },
    preloadRange () {
      if (!this.realLazy) {
        return [0, Number.POSITIVE_INFINITY]
      }

      return [
        (this.count + this.realIndex - this.realLazy.preload) % this.count,
        (this.count + this.realIndex + this.realLazy.preload) % this.count
      ]
    }
  },
  methods: {
    step (delta, focus) {
      if (
        !this.wrap &&
        (this.realIndex + delta < 0 || this.realIndex + delta > this.count - 1)
      ) {
        return
      }

      this.triggerChange((this.realIndex + delta + this.count) % this.count)

      if (focus) {
        this.focusCurrent()
      }
    },
    triggerChange (value) {
      let oldValue = this.realIndex
      this.commit('index', value)
      this.$emit('change', value, oldValue)
    },
    focusCurrent () {
      clearTimeout(this.focusTimer)
      this.focusTimer = setTimeout(() => {
        this.focused = true
        this.focusedIndex = this.realIndex
        this.$refs.item[this.realIndex].focus()
      })
    },
    handleFocusIn () {
      this.focused = true
    },
    handleFocusOut (e) {
      if (!contains(this.$el, e.relatedTarget)) {
        this.focused = false
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
