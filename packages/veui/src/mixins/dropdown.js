import { throttle } from 'lodash'
import { toggleClass } from '../utils/dom'
import outside from '../directives/outside'
import overlay from './overlay'
import activatable from './activatable'

export default {
  directives: { outside },
  mixins: [overlay, activatable],
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
