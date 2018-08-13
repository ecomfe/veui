import { throttle } from 'lodash'
import { outside } from '../directives'
import { toggleClass } from '../utils/dom'

export default {
  directives: { outside },
  data () {
    return {
      expanded: false,
      localOverlayOptions: {
        position: 'bottom left',
        constraints: [
          {
            to: 'window',
            attachment: 'together'
          }
        ]
      }
    }
  },
  methods: {
    close () {
      this.expanded = false
    },
    activate () {
      if (this.realDisabled || this.realReadonly) {
        return
      }
      this.expanded = true
    },
    handleScroll () {
      let { box } = this.$refs

      toggleClass(
        box,
        'veui-dropdown-overflow-scroll-start',
        box.scrollTop === 0
      )

      toggleClass(
        box,
        'veui-dropdown-overflow-scroll-end',
        box.scrollTop + box.offsetHeight >= box.scrollHeight
      )
    }
  },
  updated () {
    let { box } = this.$refs
    if (!box || !(box instanceof HTMLElement)) {
      return
    }

    if (box.scrollHeight > box.offsetHeight) {
      toggleClass(box, 'veui-dropdown-overflow', true)

      this.__overlay_scroll_handler__ = throttle(
        this.handleScroll,
        200,
        { leading: true }
      )

      this.handleScroll()

      box.addEventListener('scroll', this.__overlay_scroll_handler__, false)
    }
  },
  destroy () {
    if (this.__overlay_scroll_handler__) {
      this.$refs.box.removeEventListener(
        'scroll',
        this.__overlay_scroll_handler__,
        false
      )
    }
  }
}
